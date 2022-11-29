<a name="module_const"></a>

## const
thread-keeper

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  

* [const](#module_const)
    * [.CERTS_PATH](#module_const.CERTS_PATH)
    * [.DATA_PATH](#module_const.DATA_PATH)
    * [.TMP_PATH](#module_const.TMP_PATH)
    * [.TEMPLATES_PATH](#module_const.TEMPLATES_PATH)
    * [.EXECUTABLES_FOLDER](#module_const.EXECUTABLES_FOLDER)
    * [.STATIC_PATH](#module_const.STATIC_PATH)
    * [.REQUIRE_ACCESS_KEY](#module_const.REQUIRE_ACCESS_KEY)
    * [.MAX_PARALLEL_CAPTURES_TOTAL](#module_const.MAX_PARALLEL_CAPTURES_TOTAL)
    * [.MAX_PARALLEL_CAPTURES_PER_IP](#module_const.MAX_PARALLEL_CAPTURES_PER_IP)
    * [.APP_VERSION](#module_const.APP_VERSION)

<a name="module_const.CERTS_PATH"></a>

### const.CERTS\_PATH
Path to the folder holding the certificates used for signing the PDFs.
Defaults to `./certs/`
Can be replaced via the `CERTS_PATH` env variable.

**Kind**: static constant of [<code>const</code>](#module_const)  
<a name="module_const.DATA_PATH"></a>

### const.DATA\_PATH
Path to the "data" folder.
Defaults to `./app/data/`
Can be replaced via the `DATA_PATH` env variable.

**Kind**: static constant of [<code>const</code>](#module_const)  
<a name="module_const.TMP_PATH"></a>

### const.TMP\_PATH
Path to the folder in which temporary files will be written by the app.

**Kind**: static constant of [<code>const</code>](#module_const)  
<a name="module_const.TEMPLATES_PATH"></a>

### const.TEMPLATES\_PATH
Path to the "templates" folder.
Defaults to `./app/templates/`
Can be replaced via the `TEMPLATES_PATH` env variable.

**Kind**: static constant of [<code>const</code>](#module_const)  
<a name="module_const.EXECUTABLES_FOLDER"></a>

### const.EXECUTABLES\_FOLDER
Path to the "executables" folder, for dependencies that are meant to be executed directly, such as `yt-dlp`.

**Kind**: static constant of [<code>const</code>](#module_const)  
<a name="module_const.STATIC_PATH"></a>

### const.STATIC\_PATH
Path to the "static" folder.

**Kind**: static constant of [<code>const</code>](#module_const)  
<a name="module_const.REQUIRE_ACCESS_KEY"></a>

### const.REQUIRE\_ACCESS\_KEY
If `true`, users will be required to provide an access key.
Defaults to `false`.
Can be replaced via the `REQUIRE_ACCESS_KEY` env variable, if set to "1".

**Kind**: static constant of [<code>const</code>](#module_const)  
<a name="module_const.MAX_PARALLEL_CAPTURES_TOTAL"></a>

### const.MAX\_PARALLEL\_CAPTURES\_TOTAL
Maximum capture processes that can be run in parallel.
Defaults to 50.
Can be replaced via the `MAX_PARALLEL_CAPTURES_TOTAL` env variable.

**Kind**: static constant of [<code>const</code>](#module_const)  
<a name="module_const.MAX_PARALLEL_CAPTURES_PER_IP"></a>

### const.MAX\_PARALLEL\_CAPTURES\_PER\_IP
Maximum capture processes that can be run in parallel for a given IP address.
Defaults to:
- 2 if REQUIRE_ACCESS_KEY is `false`
- 10 if REQUIRE_ACCESS_KEY is `true`
Can be replaced via the `MAX_PARALLEL_CAPTURES_PER_IP` env variable.

**Kind**: static constant of [<code>const</code>](#module_const)  
<a name="module_const.APP_VERSION"></a>

### const.APP\_VERSION
APP version. Pulled from `package.json` by default.

**Kind**: static constant of [<code>const</code>](#module_const)  
