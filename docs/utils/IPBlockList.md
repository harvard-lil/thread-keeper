<a name="utils.module_IPBlockList"></a>

## IPBlockList
thread-keeper

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  

* [IPBlockList](#utils.module_IPBlockList)
    * [.IPBlockList](#utils.module_IPBlockList.IPBlockList)
        * [new exports.IPBlockList()](#new_utils.module_IPBlockList.IPBlockList_new)
        * [.filepath](#utils.module_IPBlockList.IPBlockList+filepath) : <code>string</code>
        * [.check(ip)](#utils.module_IPBlockList.IPBlockList+check)

<a name="utils.module_IPBlockList.IPBlockList"></a>

### IPBlockList.IPBlockList
Utility class for handling the app's IP block list.
[!] For alpha launch only.

**Kind**: static class of [<code>IPBlockList</code>](#utils.module_IPBlockList)  

* [.IPBlockList](#utils.module_IPBlockList.IPBlockList)
    * [new exports.IPBlockList()](#new_utils.module_IPBlockList.IPBlockList_new)
    * [.filepath](#utils.module_IPBlockList.IPBlockList+filepath) : <code>string</code>
    * [.check(ip)](#utils.module_IPBlockList.IPBlockList+check)

<a name="new_utils.module_IPBlockList.IPBlockList_new"></a>

#### new exports.IPBlockList()
On init:
- Create access keys file if it doesn't exist
- Load IPS from file into `this.#ips`.

<a name="utils.module_IPBlockList.IPBlockList+filepath"></a>

#### ipBlockList.filepath : <code>string</code>
Complete path to `ip-block-list.json`.

**Kind**: instance property of [<code>IPBlockList</code>](#utils.module_IPBlockList.IPBlockList)  
<a name="utils.module_IPBlockList.IPBlockList+check"></a>

#### ipBlockList.check(ip)
Checks that a IP is on the blocklist and (still) blocked.

**Kind**: instance method of [<code>IPBlockList</code>](#utils.module_IPBlockList.IPBlockList)  

| Param | Type |
| --- | --- |
| ip | <code>string</code> | 

