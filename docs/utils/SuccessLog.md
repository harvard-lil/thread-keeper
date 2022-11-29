<a name="utils.module_SuccessLog"></a>

## SuccessLog
thread-keeper

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  

* [SuccessLog](#utils.module_SuccessLog)
    * [.SuccessLog](#utils.module_SuccessLog.SuccessLog)
        * [new exports.SuccessLog()](#new_utils.module_SuccessLog.SuccessLog_new)
        * [.filepath](#utils.module_SuccessLog.SuccessLog+filepath) : <code>string</code>
        * [.add(identifier, why, pdfBytes)](#utils.module_SuccessLog.SuccessLog+add)
        * [.findHashInLogs(hash)](#utils.module_SuccessLog.SuccessLog+findHashInLogs) ⇒ <code>boolean</code>
        * [.reset()](#utils.module_SuccessLog.SuccessLog+reset) ⇒ <code>void</code>

<a name="utils.module_SuccessLog.SuccessLog"></a>

### SuccessLog.SuccessLog
Utility class for handling success logs. Keeps trace of the hashes of the PDFs that were generated.

**Kind**: static class of [<code>SuccessLog</code>](#utils.module_SuccessLog)  

* [.SuccessLog](#utils.module_SuccessLog.SuccessLog)
    * [new exports.SuccessLog()](#new_utils.module_SuccessLog.SuccessLog_new)
    * [.filepath](#utils.module_SuccessLog.SuccessLog+filepath) : <code>string</code>
    * [.add(identifier, why, pdfBytes)](#utils.module_SuccessLog.SuccessLog+add)
    * [.findHashInLogs(hash)](#utils.module_SuccessLog.SuccessLog+findHashInLogs) ⇒ <code>boolean</code>
    * [.reset()](#utils.module_SuccessLog.SuccessLog+reset) ⇒ <code>void</code>

<a name="new_utils.module_SuccessLog.SuccessLog_new"></a>

#### new exports.SuccessLog()
On init:
- Create log file if it doesn't exist
- Load hashes from file into `this.#hashes`.

<a name="utils.module_SuccessLog.SuccessLog+filepath"></a>

#### successLog.filepath : <code>string</code>
Complete path to `success-log.json`.

**Kind**: instance property of [<code>SuccessLog</code>](#utils.module_SuccessLog.SuccessLog)  
<a name="utils.module_SuccessLog.SuccessLog+add"></a>

#### successLog.add(identifier, why, pdfBytes)
Calculates hash of a PDF an:
- Creates a success log entry
- Updates `this.#hashes` (so it doesn't need to reload from file)

**Kind**: instance method of [<code>SuccessLog</code>](#utils.module_SuccessLog.SuccessLog)  

| Param | Type | Description |
| --- | --- | --- |
| identifier | <code>string</code> | Can be an IP or access key |
| why | <code>string</code> | Reason for creating this archive |
| pdfBytes | <code>Buffer</code> | Used to store a SHA512 hash of the PDF that was delivered |

<a name="utils.module_SuccessLog.SuccessLog+findHashInLogs"></a>

#### successLog.findHashInLogs(hash) ⇒ <code>boolean</code>
Checks whether or not a given hash is present in the logs.

**Kind**: instance method of [<code>SuccessLog</code>](#utils.module_SuccessLog.SuccessLog)  

| Param | Type |
| --- | --- |
| hash | <code>string</code> | 

<a name="utils.module_SuccessLog.SuccessLog+reset"></a>

#### successLog.reset() ⇒ <code>void</code>
Resets `success-log.json`.
Also clears `this.#hashes`.

**Kind**: instance method of [<code>SuccessLog</code>](#utils.module_SuccessLog.SuccessLog)  
