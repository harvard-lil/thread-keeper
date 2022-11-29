/**
 * thread-keeper
 * @module server.test
 * @author The Harvard Library Innovation Lab
 * @license MIT
 */
import assert from "assert";
import crypto from "crypto";

import { test } from "tap";
import Fastify from "fastify";
import isHtml from "is-html";

import server, { CAPTURES_WATCH, successLog } from "./server.js";
import { DATA_PATH, CERTS_PATH } from "./const.js";

/**
 * Dummy url of a thread to capture.
 */
const THREAD_URL = "https://twitter.com/HarvardLIL/status/1595150565428039680";

/**
 * Dummy reason for capture
 */
const WHY = "Testing thread-keeper";

test("Integration tests for server.js", async(t) => {

  // Do not run tests if `CERTS_PATH` and `DATA_PATH` do not point to a `fixtures` folder
  t.before((t) => {
    try {
      assert(DATA_PATH.includes("/fixtures/"));
      assert(CERTS_PATH.includes("/fixtures/"));
    }
    catch(err) {
      throw new Error("Test must be run against fixtures. Set CERTS_PATH and DATA_PATH env vars accordingly.");
    }
  });

  test("[GET] / returns HTTP 200 + HTML", async (t) => {
    const app = Fastify({logger: false});
    await server(app, {});

    const response = await app.inject({
      method: "GET",
      url: "/",
    });

    t.equal(response.statusCode, 200, "Server returns HTTP 200.");
    t.type(isHtml(response.body), true, "Server serves HTML.");
  });

  test("[POST] / returns HTTP 401 + HTML on blocked IP check.", async (t) => {
    const app = Fastify({logger: false});
    await server(app, {});

    const params = new URLSearchParams();
    params.append("url", THREAD_URL);

    const response = await app.inject({
      method: "POST",
      url: "/",
      remoteAddress: "1.2.3.4",
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString() 
    });

    t.equal(response.statusCode, 401, "Server returns HTTP 401.");

    const body = `${response.body}`;
    t.type(isHtml(body), true, "Server serves HTML");
    t.equal(body.includes(`data-reason="IP"`), true, "With error message.");
  });

  test("[POST] / lets IPs that are no longer blocked make requests.", async (t) => {
    const app = Fastify({logger: false});
    await server(app, {});

    const response = await app.inject({
      method: "POST",
      url: "/",
      remoteAddress: "4.3.2.1",
    });

    // Should fail because no URL were passed, not because IP was blocked
    t.equal(response.statusCode, 400, "Server returns HTTP 400.");
  });

  test("[POST] / returns HTTP 400 + HTML on failed url check.", async (t) => {
    const app = Fastify({logger: false});
    await server(app, {});

    const scenarios = [
      "https://lil.law.harvard.edu", // Non-twitter
      "twitter.com/harvardlil", // Non-url
      12,
      null // Nothing
    ]

    for (const url of scenarios) {
      const params = new URLSearchParams();

      if (url) {
        params.append("url", url);
      }

      const response = await app.inject({
        method: "POST",
        url: "/",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
    
      t.equal(response.statusCode, 400, "Server returns HTTP 400.");
      
      const body = `${response.body}`;
      t.type(isHtml(body), true, "Server serves HTML");
      t.equal(body.includes(`data-reason="URL"`), true, "With error message.");
    }
  });

  test("[POST] / returns HTTP 400 + HTML on failed \"why\" check.", async (t) => {
    const app = Fastify({logger: false});
    await server(app, {});

    const scenarios = [
      null, // Nothing
      " ", // Empty
      "",
    ]

    for (const why of scenarios) {
      const params = new URLSearchParams();

      params.append("url", THREAD_URL);

      if (why) {
        params.append("why", why);
      }

      const response = await app.inject({
        method: "POST",
        url: "/",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
    
      t.equal(response.statusCode, 400, "Server returns HTTP 400.");
      
      const body = `${response.body}`;
      t.type(isHtml(body), true, "Server serves HTML");
      t.equal(body.includes(`data-reason="WHY"`), true, "With error message.");
    }
  });

  test("[POST] / returns HTTP 503 + HTML on failed server capacity check.", async (t) => {
    const app = Fastify({logger: false});
    await server(app, {});

    CAPTURES_WATCH.currentTotal = CAPTURES_WATCH.maxTotal; // Simulate peak

    const params = new URLSearchParams();
    params.append("url", THREAD_URL);
    params.append("why", WHY);

    const response = await app.inject({
      method: "POST",
      url: "/",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    
    t.equal(response.statusCode, 503, "Server returns HTTP 503");
      
    const body = `${response.body}`;
    t.type(isHtml(body), true, "Server serves HTML");
    t.equal(body.includes(`TOO-MANY-CAPTURES-TOTAL`), true, "With error message.");

    CAPTURES_WATCH.currentTotal = 0;
  });

  test("[POST] / returns HTTP 429 + HTML on user over parallel capture allowance.", async (t) => {
    const app = Fastify({logger: false});
    await server(app, {});

    const userIp = "127.0.0.1";
    CAPTURES_WATCH.currentByIp[userIp] = CAPTURES_WATCH.maxPerIp;

    const params = new URLSearchParams();
    params.append("url", THREAD_URL);
    params.append("why", WHY);

    const response = await app.inject({
      method: "POST",
      url: "/",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString()
    });
    
    t.equal(response.statusCode, 429, "Server returns HTTP 503.");
      
    const body = `${response.body}`;
    t.type(isHtml(body), true, "Server serves HTML");
    t.equal(body.includes(`TOO-MANY-CAPTURES-USER`), true, "With error message.");

    delete CAPTURES_WATCH.currentByIp[userIp];
  });

  test("[POST] / returns HTTP 200 + PDF", async (t) => {
    const app = Fastify({logger: false});
    await server(app, {});

    const params = new URLSearchParams();
    params.append("url", THREAD_URL);
    params.append("why", WHY);
    params.append("unfold-thread", "on");

    const response = await app.inject({
      method: "POST",
      url: "/",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    t.equal(response.statusCode, 200, "Server returns HTTP 200.");
    t.equal(response.headers["content-type"], "application/pdf");
    t.equal(response.headers["content-disposition"].startsWith("attachment"), true);
    t.equal(response.body.substring(0, 8), "%PDF-1.7", "Server returns a PDF as attachment.");

    // Check filename processing
    const contentDisposition = response.headers["content-disposition"];
    const filename = contentDisposition.substring(22, contentDisposition.length - 1);
    t.match(filename, /^twitter-com-[a-z0-9-]+-[0-9]{4}-[0-9]{2}-[0-9]{2}\.pdf$/);
  });

  test("[GET] /check returns HTTP 200 + HTML", async (t) => {
    const app = Fastify({logger: false});
    await server(app, {});

    const response = await app.inject({
      method: "GET",
      url: "/check",
    });

    t.equal(response.statusCode, 200, "Server returns HTTP 200.");
    t.type(isHtml(response.body), true, "Server serves HTML.");
  });

  test("[GET] /api/v1/hashes/check/<sha512-hash> returns HTTP 404 on failed hash check.", async (t) => {
    const app = Fastify({logger: false});
    await server(app, {});

    const randomHash = crypto.createHash('sha512').update(Buffer.from("HELLO WORLD")).digest('base64');

    const response = await app.inject({
      method: "GET",
      url: `/api/v1/hashes/check/${encodeURIComponent(randomHash)}`,
    });

    t.equal(response.statusCode, 404, "Server returns HTTP 404.");
  });

  test("[GET] /api/v1/hashes/check/<sha512-hash> returns HTTP 200 on successful hash check.", async (t) => {
    const app = Fastify({logger: false});
    await server(app, {});

    // Add entry to success logs
    const toHash = Buffer.from(`${Date.now()}`);
    const hash = crypto.createHash('sha512').update(toHash).digest('base64');
    successLog.add("127.0.0.1", WHY, toHash);

    const response = await app.inject({
      method: "GET",
      url: `/api/v1/hashes/check/${encodeURIComponent(hash)}`,
    });

    t.equal(response.statusCode, 200, "Server returns HTTP 200.");
  });

});