/**
 * archive.social
 * @module utils.TwitterCapture
 * @author The Harvard Library Innovation Lab
 * @license MIT
 */
import fs from "fs";
import { spawnSync } from "child_process";
import { chromium } from "playwright";

import { v4 as uuidv4 } from "uuid";
import { PDFDocument } from "pdf-lib";

import { CERTS_PATH, TMP_PATH, EXECUTABLES_FOLDER } from "../const.js";

/**
 * Generates a "sealed" PDF out of a twitter.com url using Playwright.
 * 
 * Usage:
 * ```
 * const tweet = new TwitterCapture(url);
 * const pdf = await tweet.capture();
 * fs.writeFileSync("tweet.pdf", pdf);
 * ```
 */
export class TwitterCapture {
  /**
   * Defaults for options that can be passed to `TwitterCapture`.
   * @property {string} privateKeyPath - Path to `.pem` file containing a private key.
   * @property {string} certPath - Path to a `.pem` file containing a certificate.
   * @property {string} tmpFolderPath - Path to a folder in which temporary file can be written.
   * @property {string} ytDlpPath - Path to the `yt-dlp` executable.
   * @property {string} timestampServerUrl - Timestamping server.
   * @property {number} networkidleTimeout - Time to wait for "networkidle" state.
   * @property {boolean} runBrowserBehaviors - If `true`, will try to auto-scroll and open more responses. Set to `false` automatically when trying to capture a profile url.
   * @property {number} browserBehaviorsTimeout - Maximum browser behaviors execution time.
   * @property {number} videoCaptureTimeout - Maximum yt-dlp execution time.
   * @property {number} renderTimeout  - Time to wait for re-renders.
   */
  static defaults = {
    privateKeyPath: `${CERTS_PATH}key.pem`,
    certPath: `${CERTS_PATH}cert.pem`,
    tmpFolderPath: `${TMP_PATH}`,
    ytDlpPath: `${EXECUTABLES_FOLDER}yt-dlp`,
    timestampServerUrl: "http://timestamp.digicert.com",
    networkidleTimeout: 5000,
    runBrowserBehaviors: true,
    browserBehaviorsTimeout: 33500,
    videoCaptureTimeout: 10000,
    renderTimeout: 4000,
  };

  /** @type {object} - Based on TwitterCapture.defaults */
  options = {};

  /** @type {?string} */
  url = null;

  /** @type {?string} */
  urlType = null;

  /**
   * @type {{
   *   browser: ?import('playwright').Browser,
   *   context: ?import('playwright').BrowserContext,
   *   page: ?import('playwright').Page,
   *   viewport: ?{width: number, height: number},
   *   ready: boolean
   * }}
   */
  playwright = {
    browser: null,
    context: null,
    page: null,
    viewport: null,
    ready: false
  };

  /** @type {object<string, Buffer>} */
  interceptedJPEGs = {};

  /**
   * @param {string} url - `twitter.com` url to capture. Works best on statuses and threads.
   * @param {object} options - See `TwitterCapture.defaults` for detailed options. Will use defaults unless overridden.
   */
  constructor(url, options = {}) {
    this.filterUrl(url);
    this.filterOptions(options);

    // Options adjustments:
    if (this.urlType === "profile") {
      this.options.runBrowserBehaviors = false;
    }
  }

  /**
   * Captures the current Twitter.com url and makes it a signed PDF.
   * @returns {Promise<Buffer>} - Signed PDF.
   */
  capture = async() => {
    let rawPDF = null;
    let editablePDF = null;
    let editedPDF = null;

    // Playwright init
    await this.setup();
 
    // Page load + network idle
    try {
      await this.playwright.page.goto(this.url, {
        waitUntil: "networkidle",
        timeout: this.options.networkidleTimeout,
      });
    } 
    catch(err) { /* Timeout errors are non-blocking */ }

    // Adjust UI (#1)
    await this.adjustUIForCapture();

    // Run browser behaviors
    if (this.options.runBrowserBehaviors === true) {
      await this.runBrowserBehaviors();
    }
    else {
      await new Promise((resolve) =>
        setTimeout(resolve, this.options.networkidleTimeout + this.options.renderTimeout)
      );
    }

    // Wait for network idle 
    try {
      await this.waitForLoadState("networkidle", {timeout: this.options.networkidleTimeout});
    }
    catch(err) { /* Timeout errors are non-blocking */ }

    // Adjust UI (#2 - Accounts for re-renders)
    await this.adjustUIForCapture();

    // Resize browser to fit document dimensions
    if (this.urlType !== "profile") { // Skipped on profile pages
      await this.resizeViewportToFitDocument();
    }

    // Generate raw PDF and open editable PDF
    rawPDF = await this.generateRawPDF();
    editablePDF = await PDFDocument.load(rawPDF);

    // Add intercepted JPEGs as attachments
    await this.addInterceptedJPEGsToPDF(editablePDF);

    // Remove extraneous page, add metadata
    try {
      editablePDF.setTitle(`Capture of ${this.url} by archive.social on ${new Date().toISOString()}`);
      editablePDF.setCreationDate(new Date());
      editablePDF.setModificationDate(new Date());
      editablePDF.setProducer("archive.social");
      editablePDF.removePage(1);
    }
    catch {
      //console.log(err);
    }

    // Try to crop remaining white space
    await this.cropMarginsOnPDF(editablePDF);

    // Try to capture video, if any, and add it as attachment
    await this.captureAndAddVideoToPDF(editablePDF);

    // Freeze edited PDF in memory
    editedPDF = await editablePDF.save();

    fs.writeFileSync("unsigned.pdf", editedPDF)

    // Sign
    editedPDF = await this.signPDF(editedPDF);

    // Teardown
    try {
      await this.teardown();
    }
    catch { /* Ignore teardown errors */ }

    // Return buffer
    return editedPDF;
  }

  /**
   * Sets up the browser used for capture as well as network interception for images capture.
   * Populates `this.playwright`.
   * @returns {Promise<void>}
   */
  setup = async() => {
    const userAgent = chromium._playwright.devices["Pixel 2 XL"].userAgent;
    const viewport = chromium._playwright.devices["Pixel 2 XL"].viewport;

    this.playwright.browser = await chromium.launch({
      headless: true,
      channel: "chrome",
    });
    this.playwright.context = await this.playwright.browser.newContext({ userAgent });
    this.playwright.page = await this.playwright.context.newPage();

    this.playwright.viewport = viewport;

    this.playwright.page.setViewportSize(viewport);

    await new Promise(resolve => setTimeout(resolve, 500)); // [Debug]
    this.playwright.page.on("response", this.interceptJpegs);

    this.playwright.ready = true;
  }

  /**
   * Closes browser used for capture.
   */
  teardown = async() => {
    await this.playwright.page.close();
    await this.playwright.context.close();
    await this.playwright.browser.close();
    this.playwright.ready = true;
  }

  /**
   * Adjusts the current page's DOM so the resulting PDF is not affected by UI artifact.
   * Playwright needs to be ready.
   * 
   * @returns {Promise<void>}
   */
  adjustUIForCapture = async() => {
    if (this.playwright.ready !== true) {
      throw new Error("Playwright is not ready.");
    }

    await this.playwright.page.evaluate(async() => {
      // Nav bar and header
      document
        .querySelector("div[data-testid='TopNavBar']")
        ?.setAttribute("style", "display: none;");

      document
        .querySelector("header")
        ?.setAttribute("style", "display: none;");

      // Bottom bar
      document
        .querySelector("div[data-testid='BottomBar']")
        ?.setAttribute("style", "display: none;");

      document
        .querySelector("div[data-testid='BottomBar']")
        ?.parentNode
        ?.setAttribute("style", "display: none;");

      document
        .querySelector("div[data-testid='BottomBar']")
        ?.parentNode
        ?.parentNode
        ?.setAttribute("style", "display: none;");

      // Full-screen dialog
      document
        .querySelector("div[role='dialog']")
        ?.setAttribute("style", "display: none;");

      // "Log in" bar
      document
        .evaluate(
          "//span[text()='Not now']",
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        )
        ?.singleNodeValue
        ?.click();
    });
  }

  /**
   * Runs browser behaviors:
   * - Tries to scroll through the page.
   * - Tries to click on the next available "Show replies" button.
   * 
   * Playwright needs to be ready.
   * 
   * @returns {Promise<void>}
   */
  runBrowserBehaviors = async() => {
    if (this.playwright.ready !== true) {
      throw new Error("Playwright is not ready.");
    }

    try {
      await Promise.race([
        // Max execution time for the browser behaviors
        new Promise((resolve) => setTimeout(resolve, this.options.browserBehaviorsTimeout)),

        // Behaviors script
        this.playwright.page.evaluate(async () => {
          let scrollTop = document.documentElement.scrollTop;

          while (true) {
            // Auto scroll: +100px every 250ms
            scrollTop += 100;
            window.scrollTo({top: scrollTop});
            await new Promise(resolve => setTimeout(resolve, 250));

            // Auto click on first available "Show replies" button
            let showRepliesButton = document.evaluate(
              "//span[text()='Show replies']",
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            )?.singleNodeValue;
            
            if (showRepliesButton) {
              showRepliesButton.click();
              await new Promise(resolve => setTimeout(resolve, 1500));
            }

            // Break when reaching bottom of page
            if (scrollTop >= Math.max(document.body.scrollHeight, window.outerHeight)) {
              break;
            }
          }
        })
      ])
    }
    catch(err) {
      // Ignore behavior errors.
    }
  }

  /**
   * Stretches the viewport to match the document's dimensions.
   * @returns {Promise<void>}
   */
  resizeViewportToFitDocument = async() => {
    const viewport = await this.getDocumentDimensions();

    await this.playwright.page.setViewportSize({
      width: viewport.width,
      height: viewport.height
    });

    await new Promise(resolve => setTimeout(resolve, this.options.renderTimeout));
  }

  /**
   * Returns the current dimensions of the document.
   * Playwright needs to be ready.
   * @returns {Promise<{width: number, height: number}>}
   */
  getDocumentDimensions = async() => {
    if (this.playwright.ready !== true) {
      throw new Error("Playwright is not ready.");
    }

    return await this.playwright.page.evaluate(() =>  {
      const width = Math.max(document.body.scrollWidth, window.outerWidth);
      const height = Math.max(document.body.scrollHeight, window.outerHeight);
      return {width, height}
    });
  }

  /**
   * Uses Playwright's network interception to capture images and add them to `this.interceptedJPEGs`.
   * Called whenever Playwright processes an HTTP response.
   * 
   * @param {import('playwright').Response} response
   * @returns {Promise<void>}
   */
  interceptJpegs = async(response) => {
    try {
      const headers = await response.allHeaders();

      if (["image/jpeg"].includes(headers["content-type"])) {
        const image = await response.body();
        const url = await response.url();
        this.interceptedJPEGs[url] = image;
      }
    } 
    catch (err) {
      // Some exchanges can't be captured, and that's okay :).
    }
  }

  /**
   * Generates a PDF of the current page using Chrome Dev Tools.
   * Playwright needs to be ready.
   * 
   * Populates `this.pdf`.
   * 
   * @returns {Promise<Buffer>} - PDF Bytes
   */
  generateRawPDF = async() => {
    if (this.playwright.ready !== true) {
      throw new Error("Playwright is not ready.");
    }

    // Scroll up
    await this.playwright.page.evaluate(() => window.scrollTo({top: 0}));
    //await new Promise(resolve => setTimeout(resolve, this.options.renderTimeout));

    // Generate document
    await this.playwright.page.emulateMedia({media: 'screen'});
    const dimensions = await this.getDocumentDimensions();

    return await this.playwright.page.pdf({
      printBackground: true,
      width: dimensions.width,
      height: dimensions.height
    });
  }

  /**
   * Adds entries from `this.interceptedJPEGs` 
   * @param {PDFDocument} - Editable PDF object from `pdf-lib`.
   * @returns {Promise<void>}
   */
  addInterceptedJPEGsToPDF = async(editablePDF) => {
    for (const [url, buffer] of Object.entries(this.interceptedJPEGs)) {
      const parsedUrl = new URL(url);
      let filename = `${parsedUrl.pathname}${parsedUrl.search}`.replaceAll("/", "-");
  
      if (!filename.endsWith(".jpg")) {
        filename += ".jpg";
      }
  
      if (filename.startsWith("-")) {
        filename = filename.substring(1);
      }
  
      await editablePDF.attach(buffer.buffer, filename, {
        mimeType: 'image/jpeg',
        description: `Image captured from ${this.url}`,
        creationDate: new Date(),
        modificationDate: new Date(),
      });
    }
  }

  /**
   * Tries to capture main video from current Twitter url and add it as attachment to the PDF.
   * @param {PDFDocument} - Editable PDF object from `pdf-lib`.
   * @returns {Promise<void>}
   */
  captureAndAddVideoToPDF = async(editablePDF) => {
    const id = uuidv4();
    const filepathOut = `${this.options.tmpFolderPath}${id}.mp4`;
    const ytDlpExecutable = this.options.ytDlpPath;

    // yt-dlp health check
    try {
      const result = spawnSync(ytDlpExecutable, ["--version"], {encoding: "utf8"});

      if (result.status !== 0) {
        throw new Error(result.stderr);
      }

      const version = result.stdout.trim();

      if (!version.match(/^[0-9]{4}\.[0-9]{2}\.[0-9]{2}$/)) {
        throw new Error(`Unknown version: ${version}`);
      }
    }
    catch(err) {
      throw new Error(`"yt-dlp" executable is not available or cannot be executed. ${err}`);
    }

    // Capture
    try {
      const dlpOptions = [
        "--no-warnings", // Prevents pollution of stdout
        "--no-progress", // (Same as above)
        "--format", "mp4", // Forces .mp4 format
        "--output", filepathOut,
        this.url
      ];
  
      const spawnOptions = {
        timeout: this.options.videoCaptureTimeout,
        encoding: "utf8",
      };
  
      const result = spawnSync(ytDlpExecutable, dlpOptions, spawnOptions);
  
      if (result.status !== 0) {
        throw new Error(result.stderr);
      }
  
      const video = fs.readFileSync(filepathOut);

      if (!video) {
        return;
      }
  
      await editablePDF.attach(video.buffer, "video.mp4", {
        mimeType: 'video/mp4',
        description: `Video captured from ${this.url}`,
        creationDate: new Date(),
        modificationDate: new Date(),
      });
  
      fs.unlink(filepathOut, () => {});
    }
    catch(err) { }
  }

  /**
   * Tries to remove some of the white space at the bottom of the PDF.
   * [!] TODO: This is a "let's ship it" hack. We will need to find a better solution.
   * @param {PDFDocument} editablePDF 
   */
  cropMarginsOnPDF = async(editablePDF) => {
    const page = editablePDF.getPage(0);
    const originalHeight = page.getHeight();

    // Only crop if content > viewport
    if (this.playwright.viewport.height > originalHeight) {
      return;
    }

    const reductionFactor = this.options.runBrowserBehaviors ? 44 : 88;

    const newHeight = Math.floor(originalHeight - (originalHeight / 100 * reductionFactor));
    const yShift = originalHeight - newHeight;

    page.setSize(page.getWidth(), newHeight);
    page.translateContent(0, -yShift);
  }

  /**
   * @param {Buffer} editedPDF - PDF Bytes
   * @returns {Buffer} - PDF Bytes
   */
  signPDF = async(editedPDF) => {
    // Save PDF to disk
    const id = uuidv4();
    const filepathIn = `${this.options.tmpFolderPath}${id}-in.pdf`;
    const filepathOut = `${this.options.tmpFolderPath}${id}-out.pdf`;
    fs.writeFileSync(filepathIn, editedPDF);

    const run = spawnSync("pyhanko",
    [
      "sign",
      "addsig",
        "--field", "Sig1",
        "--timestamp-url", this.options.timestampServerUrl,
      "pemder", 
        "--key", this.options.privateKeyPath,
        "--cert", this.options.certPath,
        "--no-pass",
      filepathIn,
      filepathOut
    ], 
    {encoding: "utf-8"});


    if (run.status !== 0) {
      throw new Error(run.stderr);
    }

    // Load signed file from disk and return
    editedPDF = fs.readFileSync(filepathOut);
    fs.unlink(filepathIn, () => {});
    fs.unlink(filepathOut, () => {});
    return editedPDF;
  }

  /**
   * Applies some basic filtering to new option objects and fills gaps with defaults.
   * Replaces `this.options` after filtering.
   *
   * @param {Promise<object>} newOptions
   */
  filterOptions = async(newOptions) => {
    const options = {};
    const defaults = TwitterCapture.defaults;

    for (const key of Object.keys(defaults)) {
      options[key] = key in newOptions ? newOptions[key] : defaults[key];

      switch (typeof defaults[key]) {
        case "boolean":
          options[key] = Boolean(options[key]);
          break;

        case "number":
          options[key] = Number(options[key]);
          break;

        case "string":
          options[key] = String(options[key]);
          break;
      }
    }

    this.options = options;
  }

  /**
   * Filters a given URL to ensure it's a `twitter.com` one.
   * Also asserts it's "type": "status", "search", "profile".
   *
   * Automatically populates `this.url` and `this.urlType`.
   *
   * @param {string} url
   * @returns {bool}
   */
  filterUrl = (url) => {
    /** @type {?URL} */
    let parsedUrl = null;

    /** @type {?string} */
    let urlType = null;

    //
    // Determine if `url` is a valid `twitter.com` and remove known tracking params
    //
    try {
      parsedUrl = new URL(url); // Will throw if not a valid url.

      if (parsedUrl.origin !== "https://twitter.com") {
        throw new Error();
      }

      parsedUrl.searchParams.delete("s");
      parsedUrl.searchParams.delete("t");
      parsedUrl.searchParams.delete("ctx");
    } 
    catch (err) {
      throw new Error(`${url} is not a valid Twitter url.`);
    }

    //
    // Determine Twitter url "type"
    //
    if (parsedUrl.pathname.includes("/status/")) {
      urlType = "status";
    }
    else if (parsedUrl.pathname.includes("/search")) {
      urlType = "search";
    }
    else {
      urlType = "profile";
    }

    this.url = parsedUrl.href;
    this.urlType = urlType;

    return true;
  }
}
