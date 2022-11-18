/**
 * archive.social
 * @module server.js
 * @author The Harvard Library Innovation Lab
 * @license MIT
 */
import fs from "fs";
import assert from "assert";

import { validate as uuidValidate } from 'uuid';
import nunjucks from "nunjucks";

import { AccessKeys, SuccessLog, TwitterCapture } from "./utils/index.js";
import {
  TEMPLATES_PATH,
  STATIC_PATH,
  MAX_PARALLEL_CAPTURES_TOTAL,
  MAX_PARALLEL_CAPTURES_PER_ACCESS_KEY,
} from "./const.js";

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

/**
 * Frozen copy of currently valid access keys.
 * [!] For this alpha: app needs to be restarted for changes to be into account.
 */
const ACCESS_KEYS = AccessKeys.fetch();

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
   * Renders success page with PDF if capture went through.
   * Returns to form with specific error code, passed as `errorReason`, otherwise.
   * 
   */
  fastify.post('/', async (request, reply) => {
    const data = request.body;
    const accessKey = data["access-key"];
    
    request.log.info(`Capture capacity: ${CAPTURES_WATCH.currentTotal} / ${CAPTURES_WATCH.maxTotal}.`);
    
    //
    // Check access key
    //
    try {
      assert(uuidValidate(accessKey));
      assert(ACCESS_KEYS[accessKey]);
    }
    catch(err) {
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

      const tweets = new TwitterCapture(data.url);
      const pdf = await tweets.capture();

      SuccessLog.add(accessKey, pdf);

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
};
