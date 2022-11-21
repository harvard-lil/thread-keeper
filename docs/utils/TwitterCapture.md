<a name="utils.module_TwitterCapture"></a>

## TwitterCapture
archive.social

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  

* [TwitterCapture](#utils.module_TwitterCapture)
    * [.TwitterCapture](#utils.module_TwitterCapture.TwitterCapture)
        * [new exports.TwitterCapture(url, options)](#new_utils.module_TwitterCapture.TwitterCapture_new)
        * [.defaults](#utils.module_TwitterCapture.TwitterCapture+defaults)
        * [.options](#utils.module_TwitterCapture.TwitterCapture+options) : <code>object</code>
        * [.url](#utils.module_TwitterCapture.TwitterCapture+url) : <code>string</code>
        * [.urlType](#utils.module_TwitterCapture.TwitterCapture+urlType) : <code>string</code>
        * [.playwright](#utils.module_TwitterCapture.TwitterCapture+playwright) : <code>Object</code>
        * [.interceptedJPEGs](#utils.module_TwitterCapture.TwitterCapture+interceptedJPEGs) : <code>object.&lt;string, Buffer&gt;</code>
        * [.capture](#utils.module_TwitterCapture.TwitterCapture+capture) ⇒ <code>Promise.&lt;Buffer&gt;</code>
        * [.setup](#utils.module_TwitterCapture.TwitterCapture+setup) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.teardown](#utils.module_TwitterCapture.TwitterCapture+teardown)
        * [.adjustUIForCapture](#utils.module_TwitterCapture.TwitterCapture+adjustUIForCapture) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.runBrowserBehaviors](#utils.module_TwitterCapture.TwitterCapture+runBrowserBehaviors) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.resizeViewportToFitDocument](#utils.module_TwitterCapture.TwitterCapture+resizeViewportToFitDocument) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.getDocumentDimensions](#utils.module_TwitterCapture.TwitterCapture+getDocumentDimensions) ⇒ <code>Promise.&lt;{width: number, height: number}&gt;</code>
        * [.interceptJpegs](#utils.module_TwitterCapture.TwitterCapture+interceptJpegs) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.generateRawPDF](#utils.module_TwitterCapture.TwitterCapture+generateRawPDF) ⇒ <code>Promise.&lt;Buffer&gt;</code>
        * [.addInterceptedJPEGsToPDF](#utils.module_TwitterCapture.TwitterCapture+addInterceptedJPEGsToPDF) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.captureAndAddVideoToPDF](#utils.module_TwitterCapture.TwitterCapture+captureAndAddVideoToPDF) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.cropMarginsOnPDF](#utils.module_TwitterCapture.TwitterCapture+cropMarginsOnPDF)
        * [.signPDF](#utils.module_TwitterCapture.TwitterCapture+signPDF) ⇒ <code>Buffer</code>
        * [.filterOptions](#utils.module_TwitterCapture.TwitterCapture+filterOptions)
        * [.filterUrl](#utils.module_TwitterCapture.TwitterCapture+filterUrl) ⇒ <code>bool</code>

<a name="utils.module_TwitterCapture.TwitterCapture"></a>

### TwitterCapture.TwitterCapture
Generates a "sealed" PDF out of a twitter.com url using Playwright.

Usage:
```
const tweet = new TwitterCapture(url);
const pdf = await tweet.capture();
fs.writeFileSync("tweet.pdf", pdf);
```

**Kind**: static class of [<code>TwitterCapture</code>](#utils.module_TwitterCapture)  

* [.TwitterCapture](#utils.module_TwitterCapture.TwitterCapture)
    * [new exports.TwitterCapture(url, options)](#new_utils.module_TwitterCapture.TwitterCapture_new)
    * [.defaults](#utils.module_TwitterCapture.TwitterCapture+defaults)
    * [.options](#utils.module_TwitterCapture.TwitterCapture+options) : <code>object</code>
    * [.url](#utils.module_TwitterCapture.TwitterCapture+url) : <code>string</code>
    * [.urlType](#utils.module_TwitterCapture.TwitterCapture+urlType) : <code>string</code>
    * [.playwright](#utils.module_TwitterCapture.TwitterCapture+playwright) : <code>Object</code>
    * [.interceptedJPEGs](#utils.module_TwitterCapture.TwitterCapture+interceptedJPEGs) : <code>object.&lt;string, Buffer&gt;</code>
    * [.capture](#utils.module_TwitterCapture.TwitterCapture+capture) ⇒ <code>Promise.&lt;Buffer&gt;</code>
    * [.setup](#utils.module_TwitterCapture.TwitterCapture+setup) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.teardown](#utils.module_TwitterCapture.TwitterCapture+teardown)
    * [.adjustUIForCapture](#utils.module_TwitterCapture.TwitterCapture+adjustUIForCapture) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.runBrowserBehaviors](#utils.module_TwitterCapture.TwitterCapture+runBrowserBehaviors) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.resizeViewportToFitDocument](#utils.module_TwitterCapture.TwitterCapture+resizeViewportToFitDocument) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.getDocumentDimensions](#utils.module_TwitterCapture.TwitterCapture+getDocumentDimensions) ⇒ <code>Promise.&lt;{width: number, height: number}&gt;</code>
    * [.interceptJpegs](#utils.module_TwitterCapture.TwitterCapture+interceptJpegs) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.generateRawPDF](#utils.module_TwitterCapture.TwitterCapture+generateRawPDF) ⇒ <code>Promise.&lt;Buffer&gt;</code>
    * [.addInterceptedJPEGsToPDF](#utils.module_TwitterCapture.TwitterCapture+addInterceptedJPEGsToPDF) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.captureAndAddVideoToPDF](#utils.module_TwitterCapture.TwitterCapture+captureAndAddVideoToPDF) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.cropMarginsOnPDF](#utils.module_TwitterCapture.TwitterCapture+cropMarginsOnPDF)
    * [.signPDF](#utils.module_TwitterCapture.TwitterCapture+signPDF) ⇒ <code>Buffer</code>
    * [.filterOptions](#utils.module_TwitterCapture.TwitterCapture+filterOptions)
    * [.filterUrl](#utils.module_TwitterCapture.TwitterCapture+filterUrl) ⇒ <code>bool</code>

<a name="new_utils.module_TwitterCapture.TwitterCapture_new"></a>

#### new exports.TwitterCapture(url, options)

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | `twitter.com` url to capture. Works best on statuses and threads. |
| options | <code>object</code> | See `TwitterCapture.defaults` for detailed options. Will use defaults unless overridden. |

<a name="utils.module_TwitterCapture.TwitterCapture+defaults"></a>

#### twitterCapture.defaults
Defaults for options that can be passed to `TwitterCapture`.

**Kind**: instance property of [<code>TwitterCapture</code>](#utils.module_TwitterCapture.TwitterCapture)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| privateKeyPath | <code>string</code> | Path to `.pem` file containing a private key. |
| certPath | <code>string</code> | Path to a `.pem` file containing a certificate. |
| tmpFolderPath | <code>string</code> | Path to a folder in which temporary file can be written. |
| ytDlpPath | <code>string</code> | Path to the `yt-dlp` executable. |
| timestampServerUrl | <code>string</code> | Timestamping server. |
| networkidleTimeout | <code>number</code> | Time to wait for "networkidle" state. |
| runBrowserBehaviors | <code>boolean</code> | If `true`, will try to auto-scroll and open more responses. Set to `false` automatically when trying to capture a profile url. |
| browserBehaviorsTimeout | <code>number</code> | Maximum browser behaviors execution time. |
| videoCaptureTimeout | <code>number</code> | Maximum yt-dlp execution time. |
| renderTimeout | <code>number</code> | Time to wait for re-renders. |

<a name="utils.module_TwitterCapture.TwitterCapture+options"></a>

#### twitterCapture.options : <code>object</code>
**Kind**: instance property of [<code>TwitterCapture</code>](#utils.module_TwitterCapture.TwitterCapture)  
<a name="utils.module_TwitterCapture.TwitterCapture+url"></a>

#### twitterCapture.url : <code>string</code>
**Kind**: instance property of [<code>TwitterCapture</code>](#utils.module_TwitterCapture.TwitterCapture)  
<a name="utils.module_TwitterCapture.TwitterCapture+urlType"></a>

#### twitterCapture.urlType : <code>string</code>
**Kind**: instance property of [<code>TwitterCapture</code>](#utils.module_TwitterCapture.TwitterCapture)  
<a name="utils.module_TwitterCapture.TwitterCapture+playwright"></a>

#### twitterCapture.playwright : <code>Object</code>
**Kind**: instance property of [<code>TwitterCapture</code>](#utils.module_TwitterCapture.TwitterCapture)  
<a name="utils.module_TwitterCapture.TwitterCapture+interceptedJPEGs"></a>

#### twitterCapture.interceptedJPEGs : <code>object.&lt;string, Buffer&gt;</code>
**Kind**: instance property of [<code>TwitterCapture</code>](#utils.module_TwitterCapture.TwitterCapture)  
<a name="utils.module_TwitterCapture.TwitterCapture+capture"></a>

#### twitterCapture.capture ⇒ <code>Promise.&lt;Buffer&gt;</code>
Captures the current Twitter.com url and makes it a signed PDF.

**Kind**: instance property of [<code>TwitterCapture</code>](#utils.module_TwitterCapture.TwitterCapture)  
**Returns**: <code>Promise.&lt;Buffer&gt;</code> - - Signed PDF.  
<a name="utils.module_TwitterCapture.TwitterCapture+setup"></a>

#### twitterCapture.setup ⇒ <code>Promise.&lt;void&gt;</code>
Sets up the browser used for capture as well as network interception for images capture.
Populates `this.playwright`.

**Kind**: instance property of [<code>TwitterCapture</code>](#utils.module_TwitterCapture.TwitterCapture)  
<a name="utils.module_TwitterCapture.TwitterCapture+teardown"></a>

#### twitterCapture.teardown
Closes browser used for capture.

**Kind**: instance property of [<code>TwitterCapture</code>](#utils.module_TwitterCapture.TwitterCapture)  
<a name="utils.module_TwitterCapture.TwitterCapture+adjustUIForCapture"></a>

#### twitterCapture.adjustUIForCapture ⇒ <code>Promise.&lt;void&gt;</code>
Adjusts the current page's DOM so the resulting PDF is not affected by UI artifact. 
Playwright needs to be ready.

**Kind**: instance property of [<code>TwitterCapture</code>](#utils.module_TwitterCapture.TwitterCapture)  
<a name="utils.module_TwitterCapture.TwitterCapture+runBrowserBehaviors"></a>

#### twitterCapture.runBrowserBehaviors ⇒ <code>Promise.&lt;void&gt;</code>
Runs browser behaviors:
- Tries to scroll through the page.
- Tries to click on the next available "Show replies" button.

Playwright needs to be ready.

**Kind**: instance property of [<code>TwitterCapture</code>](#utils.module_TwitterCapture.TwitterCapture)  
<a name="utils.module_TwitterCapture.TwitterCapture+resizeViewportToFitDocument"></a>

#### twitterCapture.resizeViewportToFitDocument ⇒ <code>Promise.&lt;void&gt;</code>
Stretches the viewport to match the document's dimensions.

**Kind**: instance property of [<code>TwitterCapture</code>](#utils.module_TwitterCapture.TwitterCapture)  
<a name="utils.module_TwitterCapture.TwitterCapture+getDocumentDimensions"></a>

#### twitterCapture.getDocumentDimensions ⇒ <code>Promise.&lt;{width: number, height: number}&gt;</code>
Returns the current dimensions of the document.
Playwright needs to be ready.

**Kind**: instance property of [<code>TwitterCapture</code>](#utils.module_TwitterCapture.TwitterCapture)  
<a name="utils.module_TwitterCapture.TwitterCapture+interceptJpegs"></a>

#### twitterCapture.interceptJpegs ⇒ <code>Promise.&lt;void&gt;</code>
Uses Playwright's network interception to capture images and add them to `this.interceptedJPEGs`.
Called whenever Playwright processes an HTTP response.

**Kind**: instance property of [<code>TwitterCapture</code>](#utils.module_TwitterCapture.TwitterCapture)  

| Param | Type |
| --- | --- |
| response | <code>playwright.Response</code> | 

<a name="utils.module_TwitterCapture.TwitterCapture+generateRawPDF"></a>

#### twitterCapture.generateRawPDF ⇒ <code>Promise.&lt;Buffer&gt;</code>
Generates a PDF of the current page using Chrome Dev Tools.
Playwright needs to be ready.

Populates `this.pdf`.

**Kind**: instance property of [<code>TwitterCapture</code>](#utils.module_TwitterCapture.TwitterCapture)  
**Returns**: <code>Promise.&lt;Buffer&gt;</code> - - PDF Bytes  
<a name="utils.module_TwitterCapture.TwitterCapture+addInterceptedJPEGsToPDF"></a>

#### twitterCapture.addInterceptedJPEGsToPDF ⇒ <code>Promise.&lt;void&gt;</code>
Adds entries from `this.interceptedJPEGs`

**Kind**: instance property of [<code>TwitterCapture</code>](#utils.module_TwitterCapture.TwitterCapture)  

| Type | Description |
| --- | --- |
| <code>PDFDocument</code> | Editable PDF object from `pdf-lib`. |

<a name="utils.module_TwitterCapture.TwitterCapture+captureAndAddVideoToPDF"></a>

#### twitterCapture.captureAndAddVideoToPDF ⇒ <code>Promise.&lt;void&gt;</code>
Tries to capture main video from current Twitter url and add it as attachment to the PDF.

**Kind**: instance property of [<code>TwitterCapture</code>](#utils.module_TwitterCapture.TwitterCapture)  

| Type | Description |
| --- | --- |
| <code>PDFDocument</code> | Editable PDF object from `pdf-lib`. |

<a name="utils.module_TwitterCapture.TwitterCapture+cropMarginsOnPDF"></a>

#### twitterCapture.cropMarginsOnPDF
Tries to remove some of the white space at the bottom of the PDF.
[!] TODO: This is a "let's ship it" hack. We will need to find a better solution.

**Kind**: instance property of [<code>TwitterCapture</code>](#utils.module_TwitterCapture.TwitterCapture)  

| Param | Type |
| --- | --- |
| editablePDF | <code>PDFDocument</code> | 

<a name="utils.module_TwitterCapture.TwitterCapture+signPDF"></a>

#### twitterCapture.signPDF ⇒ <code>Buffer</code>
**Kind**: instance property of [<code>TwitterCapture</code>](#utils.module_TwitterCapture.TwitterCapture)  
**Returns**: <code>Buffer</code> - - PDF Bytes  

| Param | Type | Description |
| --- | --- | --- |
| editedPDF | <code>Buffer</code> | PDF Bytes |

<a name="utils.module_TwitterCapture.TwitterCapture+filterOptions"></a>

#### twitterCapture.filterOptions
Applies some basic filtering to new option objects and fills gaps with defaults.
Replaces `this.options` after filtering.

**Kind**: instance property of [<code>TwitterCapture</code>](#utils.module_TwitterCapture.TwitterCapture)  

| Param | Type |
| --- | --- |
| newOptions | <code>Promise.&lt;object&gt;</code> | 

<a name="utils.module_TwitterCapture.TwitterCapture+filterUrl"></a>

#### twitterCapture.filterUrl ⇒ <code>bool</code>
Filters a given URL to ensure it's a `twitter.com` one.
Also asserts it's "type": "status", "search", "profile".

Automatically populates `this.url` and `this.urlType`.

**Kind**: instance property of [<code>TwitterCapture</code>](#utils.module_TwitterCapture.TwitterCapture)  

| Param | Type |
| --- | --- |
| url | <code>string</code> | 

