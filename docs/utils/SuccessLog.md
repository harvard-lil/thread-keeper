<a name="utils.module_logCaptureSuccess"></a>

## logCaptureSuccess
archive.social

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  

* [logCaptureSuccess](#utils.module_logCaptureSuccess)
    * [.SuccessLog](#utils.module_logCaptureSuccess.SuccessLog)
        * [new exports.SuccessLog()](#new_utils.module_logCaptureSuccess.SuccessLog_new)
        * [.filepath](#utils.module_logCaptureSuccess.SuccessLog+filepath) : <code>string</code>
        * [.add(accessKey, pdfBytes)](#utils.module_logCaptureSuccess.SuccessLog+add)
        * [.findHashInLogs(hash)](#utils.module_logCaptureSuccess.SuccessLog+findHashInLogs) ⇒ <code>boolean</code>
        * [.reset()](#utils.module_logCaptureSuccess.SuccessLog+reset) ⇒ <code>void</code>

<a name="utils.module_logCaptureSuccess.SuccessLog"></a>

### logCaptureSuccess.SuccessLog
**Kind**: static class of [<code>logCaptureSuccess</code>](#utils.module_logCaptureSuccess)  

* [.SuccessLog](#utils.module_logCaptureSuccess.SuccessLog)
    * [new exports.SuccessLog()](#new_utils.module_logCaptureSuccess.SuccessLog_new)
    * [.filepath](#utils.module_logCaptureSuccess.SuccessLog+filepath) : <code>string</code>
    * [.add(accessKey, pdfBytes)](#utils.module_logCaptureSuccess.SuccessLog+add)
    * [.findHashInLogs(hash)](#utils.module_logCaptureSuccess.SuccessLog+findHashInLogs) ⇒ <code>boolean</code>
    * [.reset()](#utils.module_logCaptureSuccess.SuccessLog+reset) ⇒ <code>void</code>

<a name="new_utils.module_logCaptureSuccess.SuccessLog_new"></a>

#### new exports.SuccessLog()
On init:
- Create log file if it doesn't exist
- Load hashes from file into `this.#hashes`.

<a name="utils.module_logCaptureSuccess.SuccessLog+filepath"></a>

#### successLog.filepath : <code>string</code>
Complete path to `success-log.json`.

**Kind**: instance property of [<code>SuccessLog</code>](#utils.module_logCaptureSuccess.SuccessLog)  
<a name="utils.module_logCaptureSuccess.SuccessLog+add"></a>

#### successLog.add(accessKey, pdfBytes)
Calculates hash of a PDF an:
- Creates a success log entry
- Updates `this.#hashes` (so it doesn't need to reload from file)

**Kind**: instance method of [<code>SuccessLog</code>](#utils.module_logCaptureSuccess.SuccessLog)  

| Param | Type | Description |
| --- | --- | --- |
| accessKey | <code>string</code> |  |
| pdfBytes | <code>Buffer</code> | Used to store a SHA512 hash of the PDF that was delivered |

<a name="utils.module_logCaptureSuccess.SuccessLog+findHashInLogs"></a>

#### successLog.findHashInLogs(hash) ⇒ <code>boolean</code>
Checks whether or not a given hash is present in the logs.

**Kind**: instance method of [<code>SuccessLog</code>](#utils.module_logCaptureSuccess.SuccessLog)  

| Param | Type |
| --- | --- |
| hash | <code>string</code> | 

<a name="utils.module_logCaptureSuccess.SuccessLog+reset"></a>

#### successLog.reset() ⇒ <code>void</code>
Resets `success-log.json`.
Also clears `this.#hashes`.

**Kind**: instance method of [<code>SuccessLog</code>](#utils.module_logCaptureSuccess.SuccessLog)  
