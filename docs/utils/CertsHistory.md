<a name="utils.module_CertsHistory"></a>

## CertsHistory
thread-keeper

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  

* [CertsHistory](#utils.module_CertsHistory)
    * [.CertsHistory](#utils.module_CertsHistory.CertsHistory)
        * _instance_
            * [.signingFilepath](#utils.module_CertsHistory.CertsHistory+signingFilepath) : <code>string</code>
            * [.timestampingFilepath](#utils.module_CertsHistory.CertsHistory+timestampingFilepath) : <code>string</code>
        * _static_
            * [.load([type])](#utils.module_CertsHistory.CertsHistory.load)

<a name="utils.module_CertsHistory.CertsHistory"></a>

### CertsHistory.CertsHistory
Utility class for handling the "certificates history" files.
Expected structure:
```
[
  {
    "from": "2022-11-18 13:07:56 UTC",
    "to": "2022-11-22 19:00:00 UTC",
    "domain": "domain.ext",
    "info": "...",
    "cert": "..."
  },
  ...
]
```

**Kind**: static class of [<code>CertsHistory</code>](#utils.module_CertsHistory)  

* [.CertsHistory](#utils.module_CertsHistory.CertsHistory)
    * _instance_
        * [.signingFilepath](#utils.module_CertsHistory.CertsHistory+signingFilepath) : <code>string</code>
        * [.timestampingFilepath](#utils.module_CertsHistory.CertsHistory+timestampingFilepath) : <code>string</code>
    * _static_
        * [.load([type])](#utils.module_CertsHistory.CertsHistory.load)

<a name="utils.module_CertsHistory.CertsHistory+signingFilepath"></a>

#### certsHistory.signingFilepath : <code>string</code>
Complete path to `signing-certs-history.json`.

**Kind**: instance property of [<code>CertsHistory</code>](#utils.module_CertsHistory.CertsHistory)  
<a name="utils.module_CertsHistory.CertsHistory+timestampingFilepath"></a>

#### certsHistory.timestampingFilepath : <code>string</code>
Complete path to `timestamping-certs-history.json`.

**Kind**: instance property of [<code>CertsHistory</code>](#utils.module_CertsHistory.CertsHistory)  
<a name="utils.module_CertsHistory.CertsHistory.load"></a>

#### CertsHistory.load([type])
Returns the parsed contents of a certificates history file.
Creates said file if it doesn't exist.

**Kind**: static method of [<code>CertsHistory</code>](#utils.module_CertsHistory.CertsHistory)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [type] | <code>string</code> | <code>&quot;\&quot;signing\&quot;&quot;</code> | Can be "signing" or "timestamping". |

