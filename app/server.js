/**
 * archive.social
 * @module server.js
 * @author The Harvard Library Innovation Lab
 * @license MIT
 */
import assert from "assert";

import nunjucks from "nunjucks";

import { AccessKeys, SuccessLog, TwitterCapture } from "./utils/index.js";
import {
  TEMPLATES_PATH,
  STATIC_PATH,
  MAX_PARALLEL_CAPTURES_TOTAL,
  MAX_PARALLEL_CAPTURES_PER_ACCESS_KEY,
} from "./const.js";

/**
 * @type {SuccessLog}
 */
const successLog = new SuccessLog();

/**
 * @type {AccessKeys}
 */
const accessKeys = new AccessKeys();

/**
 * Keeps track of how many capture processes are currently running.
 * May be used to redirect users if over capacity.
 * 
 * [!] This needs to be upgraded to proper rate limiting after launch.
 * 
 * @type {{
 *  currentTotal: number, 
 *  maxTotal: number, 
 *  currentByAccessKey: object.<string, number>, 
 *  maxPerAccessKey: number
 * }}
 */
const CAPTURES_WATCH = {
  currentTotal: 0,
  maxTotal: MAX_PARALLEL_CAPTURES_TOTAL,
  currentByAccessKey: {},
  maxPerAccessKey: MAX_PARALLEL_CAPTURES_PER_ACCESS_KEY,
}

export default async function (fastify, opts) {

  // Adds support for `application/x-www-form-urlencoded`
  fastify.register(import('@fastify/formbody'));

  // Serves files from STATIC_PATH
  fastify.register(import('@fastify/static'), {
    root: STATIC_PATH,
    prefix: '/static/',
  });

  /**
   * [GET] / 
   * Shows the landing page / form.
   */
  fastify.get('/', async (request, reply) => {
    const html = nunjucks.render(`${TEMPLATES_PATH}index.njk`);

    return reply
      .code(200)
      .header('Content-Type', 'text/html; charset=utf-8')
      .send(html);
  });

  /**
   * [POST] /
   * Processes a request to capture a twitter url. 
   * Serves PDF bytes directly if operation is successful.
   * Returns to form with specific error code, passed as `errorReason`, otherwise.
   */
  fastify.post('/', async (request, reply) => {
    const data = request.body;
    const accessKey = data["access-key"];
    
    request.log.info(`Capture capacity: ${CAPTURES_WATCH.currentTotal} / ${CAPTURES_WATCH.maxTotal}.`);
    
    //
    // Check access key
    //
    if (!accessKeys.check(accessKey)) {
      const html = nunjucks.render(`${TEMPLATES_PATH}index.njk`, {
        error: true,
        errorReason: "ACCESS-KEY"
      });

      return reply
        .code(401)
        .header('Content-Type', 'text/html; charset=utf-8')
        .send(html);
    }

    //
    // Check url
    //
    try {
      const url = new URL(data.url);
      assert(url.origin === "https://twitter.com");
    }
    catch(err) {
      const html = nunjucks.render(`${TEMPLATES_PATH}index.njk`, {
        error: true,
        errorReason: "URL"
      });

      return reply
        .code(400)
        .header('Content-Type', 'text/html; charset=utf-8')
        .send(html);
    }

    //
    // Check that there is still capture capacity (total)
    //
    if (CAPTURES_WATCH.currentTotal >= CAPTURES_WATCH.maxTotal) {
      const html = nunjucks.render(`${TEMPLATES_PATH}index.njk`, {
        error: true,
        errorReason: "TOO-MANY-CAPTURES-TOTAL"
      });

      return reply
        .code(503)
        .header('Content-Type', 'text/html; charset=utf-8')
        .send(html);
    }

    //
    // Check that there is still capture capacity (for this access key)
    //
    if (CAPTURES_WATCH.currentByAccessKey[accessKey] >= CAPTURES_WATCH.maxPerAccessKey) {
      const html = nunjucks.render(`${TEMPLATES_PATH}index.njk`, {
        error: true,
        errorReason: "TOO-MANY-CAPTURES-USER"
      });

      return reply
        .code(429)
        .header('Content-Type', 'text/html; charset=utf-8')
        .send(html);
    }

    //
    // Process capture request
    //
    try {
      CAPTURES_WATCH.currentTotal += 1;

      if (accessKey in CAPTURES_WATCH.currentByAccessKey) {
        CAPTURES_WATCH.currentByAccessKey[accessKey] += 1;
      }
      else {
        CAPTURES_WATCH.currentByAccessKey[accessKey] = 1;
      }

      const tweets = new TwitterCapture(data.url, {runBrowserBehaviors: "auto-scroll" in data});
      const pdf = await tweets.capture();

      successLog.add(accessKey, pdf);

      return reply
        .code(200)
        .header('Content-Type', 'application/pdf')
        .header('Content-Disposition', 'attachment; filename="capture.pdf"')
        .send(pdf);
    }
    catch(err) {
      request.log.error(`Capture failed. ${err}`);

      const html = nunjucks.render(`${TEMPLATES_PATH}index.njk`, {
        error: true,
        errorReason: "CAPTURE-ISSUE"
      });

      return reply
        .code(500)
        .header('Content-Type', 'text/html; charset=utf-8')
        .send(html);
    }
    // In any case: we need to decrease CAPTURES_WATCH counts.
    finally {
      CAPTURES_WATCH.currentTotal -= 1;

      if (accessKey && accessKey in CAPTURES_WATCH.currentByAccessKey) {
        CAPTURES_WATCH.currentByAccessKey[data["access-key"]] -= 1;
      }
    }

  });


  /**
   * [GET] /api/v1/hashes/check/<sha512-hash>
   * Checks if a given SHA512 hash is in the "success" logs, meaning this app created it.
   * Hash is passed as the last parameter, url encoded.
   * 
   * Returns HTTP 200 if found, HTTP 404 if not. 
   */
   fastify.get('/api/v1/hashes/check/:hash', async (request, reply) => {
    let found = false;
    const { hash } = request.params;

    if (hash.length === 95 || hash.length === 88) {
      found = successLog.findHashInLogs(hash);
    }

    return reply.code(found ? 200 : 404).send();
  });
};
