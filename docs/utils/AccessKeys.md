<a name="utils.module_AccessKeys"></a>

## AccessKeys
thread-keeper

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  

* [AccessKeys](#utils.module_AccessKeys)
    * [.AccessKeys](#utils.module_AccessKeys.AccessKeys)
        * [new exports.AccessKeys()](#new_utils.module_AccessKeys.AccessKeys_new)
        * [.filepath](#utils.module_AccessKeys.AccessKeys+filepath) : <code>string</code>
        * [.check(accessKey)](#utils.module_AccessKeys.AccessKeys+check)

<a name="utils.module_AccessKeys.AccessKeys"></a>

### AccessKeys.AccessKeys
Utility class for handling access keys to the app.
[!] For alpha launch only.

**Kind**: static class of [<code>AccessKeys</code>](#utils.module_AccessKeys)  

* [.AccessKeys](#utils.module_AccessKeys.AccessKeys)
    * [new exports.AccessKeys()](#new_utils.module_AccessKeys.AccessKeys_new)
    * [.filepath](#utils.module_AccessKeys.AccessKeys+filepath) : <code>string</code>
    * [.check(accessKey)](#utils.module_AccessKeys.AccessKeys+check)

<a name="new_utils.module_AccessKeys.AccessKeys_new"></a>

#### new exports.AccessKeys()
On init:
- Create access keys file if it doesn't exist
- Load keys from file into `this.#keys`.

<a name="utils.module_AccessKeys.AccessKeys+filepath"></a>

#### accessKeys.filepath : <code>string</code>
Complete path to `access-keys.json`.

**Kind**: instance property of [<code>AccessKeys</code>](#utils.module_AccessKeys.AccessKeys)  
<a name="utils.module_AccessKeys.AccessKeys+check"></a>

#### accessKeys.check(accessKey)
Checks that a given access key is valid and active.

**Kind**: instance method of [<code>AccessKeys</code>](#utils.module_AccessKeys.AccessKeys)  

| Param | Type |
| --- | --- |
| accessKey | <code>string</code> | 

