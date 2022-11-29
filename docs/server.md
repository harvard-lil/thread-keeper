<a name="module_server"></a>

## server
thread-keeper

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  

* [server](#module_server)
    * _static_
        * [.successLog](#module_server.successLog) : <code>SuccessLog</code>
        * [.options](#module_server.options)
        * [.CAPTURES_WATCH](#module_server.CAPTURES_WATCH) : <code>Object</code>
    * _inner_
        * [~nunjucksEnv](#module_server..nunjucksEnv) : <code>nunjucks.Environment</code>
        * [~ipBlockList](#module_server..ipBlockList) : <code>IPBlockList</code>
        * [~accessKeys](#module_server..accessKeys) : <code>AccessKeys</code>
        * [~index(request, reply)](#module_server..index) ⇒ <code>Promise.&lt;fastify.FastifyReply&gt;</code>
        * [~capture(request, reply)](#module_server..capture) ⇒ <code>Promise.&lt;fastify.FastifyReply&gt;</code>
        * [~check(request, reply)](#module_server..check) ⇒ <code>Promise.&lt;fastify.FastifyReply&gt;</code>
        * [~checkHash(request, reply)](#module_server..checkHash) ⇒ <code>Promise.&lt;fastify.FastifyReply&gt;</code>

<a name="module_server.successLog"></a>

### server.successLog : <code>SuccessLog</code>
**Kind**: static constant of [<code>server</code>](#module_server)  
<a name="module_server.options"></a>

### server.options
Fastify-cli options

**Kind**: static constant of [<code>server</code>](#module_server)  
<a name="module_server.CAPTURES_WATCH"></a>

### server.CAPTURES\_WATCH : <code>Object</code>
Keeps track of how many capture processes are currently running. 
May be used to redirect users if over capacity. 

[!] Only good for early prototyping.

**Kind**: static constant of [<code>server</code>](#module_server)  
<a name="module_server..nunjucksEnv"></a>

### server~nunjucksEnv : <code>nunjucks.Environment</code>
**Kind**: inner constant of [<code>server</code>](#module_server)  
<a name="module_server..ipBlockList"></a>

### server~ipBlockList : <code>IPBlockList</code>
**Kind**: inner constant of [<code>server</code>](#module_server)  
<a name="module_server..accessKeys"></a>

### server~accessKeys : <code>AccessKeys</code>
**Kind**: inner constant of [<code>server</code>](#module_server)  
<a name="module_server..index"></a>

### server~index(request, reply) ⇒ <code>Promise.&lt;fastify.FastifyReply&gt;</code>
[GET] /
Shows the landing page and capture form.
Assumes `fastify` is in scope.

**Kind**: inner method of [<code>server</code>](#module_server)  

| Param | Type |
| --- | --- |
| request | <code>fastify.FastifyRequest</code> | 
| reply | <code>fastify.FastifyReply</code> | 

<a name="module_server..capture"></a>

### server~capture(request, reply) ⇒ <code>Promise.&lt;fastify.FastifyReply&gt;</code>
[POST] `/`
Processes a request to capture a `twitter.com` url. 
Serves PDF bytes directly if operation is successful.
Returns to form with specific error code, passed as `errorReason`, otherwise.
Subject to captures rate limiting (see `CAPTURES_WATCH`). 

Body is expected as `application/x-www-form-urlencoded` with the following fields:
- url
- why
- access-key [If `REQUIRE_ACCESS_KEY` is enabled]
- unfold-thread (optional)

Assumes `fastify` is in scope.

**Kind**: inner method of [<code>server</code>](#module_server)  

| Param | Type |
| --- | --- |
| request | <code>fastify.FastifyRequest</code> | 
| reply | <code>fastify.FastifyReply</code> | 

<a name="module_server..check"></a>

### server~check(request, reply) ⇒ <code>Promise.&lt;fastify.FastifyReply&gt;</code>
[GET] /check
Shows the "check" page /check form. Loads certificates history files in the process.
Assumes `fastify` is in scope.

**Kind**: inner method of [<code>server</code>](#module_server)  

| Param | Type |
| --- | --- |
| request | <code>fastify.FastifyRequest</code> | 
| reply | <code>fastify.FastifyReply</code> | 

<a name="module_server..checkHash"></a>

### server~checkHash(request, reply) ⇒ <code>Promise.&lt;fastify.FastifyReply&gt;</code>
[GET] `/api/v1/hashes/check/<sha512-hash>`. 
Checks if a given SHA512 hash is in the "success" logs, meaning this app created it. 
Hash is passed as the last parameter, url encoded. 
Assumes `fastify` is in scope. 

Returns HTTP 200 if found, HTTP 404 if not.

**Kind**: inner method of [<code>server</code>](#module_server)  

| Param | Type |
| --- | --- |
| request | <code>fastify.FastifyRequest</code> | 
| reply | <code>fastify.FastifyReply</code> | 

