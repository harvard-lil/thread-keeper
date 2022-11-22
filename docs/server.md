<a name="server.module_js"></a>

## js
thread-keeper

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  

* [js](#server.module_js)
    * [~successLog](#server.module_js..successLog) : <code>SuccessLog</code>
    * [~accessKeys](#server.module_js..accessKeys) : <code>AccessKeys</code>
    * [~CAPTURES_WATCH](#server.module_js..CAPTURES_WATCH) : <code>Object</code>
    * [~index(request, reply)](#server.module_js..index) ⇒ <code>Promise.&lt;fastify.FastifyReply&gt;</code>
    * [~check(request, reply)](#server.module_js..check) ⇒ <code>Promise.&lt;fastify.FastifyReply&gt;</code>
    * [~capture(request, reply)](#server.module_js..capture) ⇒ <code>Promise.&lt;fastify.FastifyReply&gt;</code>
    * [~checkHash(request, reply)](#server.module_js..checkHash) ⇒ <code>Promise.&lt;fastify.FastifyReply&gt;</code>

<a name="server.module_js..successLog"></a>

### js~successLog : <code>SuccessLog</code>
**Kind**: inner constant of [<code>js</code>](#server.module_js)  
<a name="server.module_js..accessKeys"></a>

### js~accessKeys : <code>AccessKeys</code>
**Kind**: inner constant of [<code>js</code>](#server.module_js)  
<a name="server.module_js..CAPTURES_WATCH"></a>

### js~CAPTURES\_WATCH : <code>Object</code>
Keeps track of how many capture processes are currently running. 
May be used to redirect users if over capacity. 

[!] Only good for early prototyping.

**Kind**: inner constant of [<code>js</code>](#server.module_js)  
<a name="server.module_js..index"></a>

### js~index(request, reply) ⇒ <code>Promise.&lt;fastify.FastifyReply&gt;</code>
[GET] / 
Shows the landing page / form.
Assumes `fastify` is in scope.

**Kind**: inner method of [<code>js</code>](#server.module_js)  

| Param | Type |
| --- | --- |
| request | <code>fastify.FastifyRequest</code> | 
| reply | <code>fastify.FastifyReply</code> | 

<a name="server.module_js..check"></a>

### js~check(request, reply) ⇒ <code>Promise.&lt;fastify.FastifyReply&gt;</code>
[GET] /check
Shows the "check" page /check form. Loads certificates history files in the process.
Assumes `fastify` is in scope.

**Kind**: inner method of [<code>js</code>](#server.module_js)  

| Param | Type |
| --- | --- |
| request | <code>fastify.FastifyRequest</code> | 
| reply | <code>fastify.FastifyReply</code> | 

<a name="server.module_js..capture"></a>

### js~capture(request, reply) ⇒ <code>Promise.&lt;fastify.FastifyReply&gt;</code>
[POST] `/`
Processes a request to capture a `twitter.com` url. 
Serves PDF bytes directly if operation is successful.
Returns to form with specific error code, passed as `errorReason`, otherwise.
Assumes `fastify` is in scope.

**Kind**: inner method of [<code>js</code>](#server.module_js)  

| Param | Type |
| --- | --- |
| request | <code>fastify.FastifyRequest</code> | 
| reply | <code>fastify.FastifyReply</code> | 

<a name="server.module_js..checkHash"></a>

### js~checkHash(request, reply) ⇒ <code>Promise.&lt;fastify.FastifyReply&gt;</code>
[GET] `/api/v1/hashes/check/<sha512-hash>`. 
Checks if a given SHA512 hash is in the "success" logs, meaning this app created it. 
Hash is passed as the last parameter, url encoded. 
Assumes `fastify` is in scope. 

Returns HTTP 200 if found, HTTP 404 if not.

**Kind**: inner method of [<code>js</code>](#server.module_js)  

| Param | Type |
| --- | --- |
| request | <code>fastify.FastifyRequest</code> | 
| reply | <code>fastify.FastifyReply</code> | 

