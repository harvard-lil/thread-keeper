/**
 * thread-keeper
 * @module server
 * @author The Harvard Library Innovation Lab
 * @license MIT
 */
import assert from "assert";

import nunjucks from "nunjucks";

import { AccessKeys, IPBlockList, CertsHistory, SuccessLog, TwitterCapture } from "./utils/index.js";
import {
  TEMPLATES_PATH,
  STATIC_PATH,
  MAX_PARALLEL_CAPTURES_TOTAL,
  MAX_PARALLEL_CAPTURES_PER_IP,
  REQUIRE_ACCESS_KEY
} from "./const.js";


/**
 * @type {SuccessLog}
 */
export const successLog = new SuccessLog();

/**
 * @type {IPBlockList}
 */
const ipBlockList = new IPBlockList();

/**
 * @type {AccessKey}
 */
const accessKeys = new AccessKeys();

/**
 * Fastify-cli options
 * @constant
 */
export const options = {
  trustProxy: true,
  logger: true
}

/**
 * Keeps track of how many capture processes are currently running. 
 * May be used to redirect users if over capacity. 
 * 
 * [!] Only good for early prototyping. 
 * 
 * @type {{
 *  currentTotal: number, 
 *  maxTotal: number, 
 *  currentByIp: object.<string, number>, 
 *  maxPerIp: number
 * }}
 */
export const CAPTURES_WATCH = {
  currentTotal: 0,
  maxTotal: MAX_PARALLEL_CAPTURES_TOTAL,
  currentByIp: {},
  maxPerIp: MAX_PARALLEL_CAPTURES_PER_IP
}

export default async function (fastify, opts) {
  // Adds support for `application/x-www-form-urlencoded`
  fastify.register(import('@fastify/formbody'));

  fastify.register(import("@fastify/static"), {
    root: STATIC_PATH,
    prefix: "/static/",
  });

  fastify.setNotFoundHandler((request, reply) => {
    reply
      .code(404)
      .type('text/html')
      .send(nunjucks.render(`${TEMPLATES_PATH}404.njk`));
  });

  fastify.get('/', index);
  fastify.post('/', capture);

  fastify.get('/check', check);

  fastify.get('/api/v1/hashes/check/:hash', checkHash);
};

/**
 * [GET] /
 * Shows the landing page and capture form.
 * Assumes `fastify` is in scope.
 * 
 * @param {fastify.FastifyRequest} request
 * @param {fastify.FastifyReply} reply 
 * @returns {Promise<fastify.FastifyReply>}
 */
async function index(request, reply) {
  const html = nunjucks.render(`${TEMPLATES_PATH}index.njk`, {REQUIRE_ACCESS_KEY});

  return reply
    .code(200)
    .header('Content-Type', 'text/html; charset=utf-8')
    .send(html);
}

/**
 * [POST] `/`
 * Processes a request to capture a `twitter.com` url. 
 * Serves PDF bytes directly if operation is successful.
 * Returns to form with specific error code, passed as `errorReason`, otherwise.
 * Subject to captures rate limiting (see `CAPTURES_WATCH`). 
 * 
 * Body is expected as `application/x-www-form-urlencoded` with the following fields:
 * - url
 * - why
 * - access-key [If `REQUIRE_ACCESS_KEY` is enabled]
 * - unfold-thread (optional)
 * 
 * Assumes `fastify` is in scope.
 * 
 * @param {fastify.FastifyRequest} request
 * @param {fastify.FastifyReply} reply 
 * @returns {Promise<fastify.FastifyReply>}
 */
async function capture(request, reply) {
  const data = request.body;
  const ip = request.ip;
  let why = null;
  let accessKey = null;

  request.log.info(`Capture capacity: ${CAPTURES_WATCH.currentTotal} / ${CAPTURES_WATCH.maxTotal}.`);

  //
  // Check that IP is not in block list
  //
  if (ipBlockList.check(ip)) {
    const html = nunjucks.render(`${TEMPLATES_PATH}index.njk`, {
      error: true,
      errorReason: "IP",
      REQUIRE_ACCESS_KEY
    });

    return reply
      .code(401)
      .header('Content-Type', 'text/html; charset=utf-8')
      .send(html);
  }

  //
  // Check access key if required
  //
  if (REQUIRE_ACCESS_KEY) {
    try {
      accessKey = data["access-key"];
      assert(accessKeys.check(accessKey));
    }
    catch(err) {
      const html = nunjucks.render(`${TEMPLATES_PATH}index.njk`, {
        error: true,
        errorReason: "ACCESS-KEY",
        REQUIRE_ACCESS_KEY
      });

      return reply
      .code(401)
      .header('Content-Type', 'text/html; charset=utf-8')
      .send(html);
    }
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
      errorReason: "URL",
      REQUIRE_ACCESS_KEY
    });

    return reply
      .code(400)
      .header('Content-Type', 'text/html; charset=utf-8')
      .send(html);
  }

  //
  // Check "why" field
  //
  try {
    why = data.why.trim();
    assert(why.length > 0);
  }
  catch(err) {
    const html = nunjucks.render(`${TEMPLATES_PATH}index.njk`, {
      error: true,
      errorReason: "WHY",
      REQUIRE_ACCESS_KEY
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
      errorReason: "TOO-MANY-CAPTURES-TOTAL",
      REQUIRE_ACCESS_KEY
    });

    return reply
      .code(503)
      .header('Content-Type', 'text/html; charset=utf-8')
      .send(html);
  }

  //
  // Check that there is still capture capacity (for this IP)
  //
  if (CAPTURES_WATCH.currentByIp[ip] >= CAPTURES_WATCH.maxPerIp) {
    const html = nunjucks.render(`${TEMPLATES_PATH}index.njk`, {
      error: true,
      errorReason: "TOO-MANY-CAPTURES-USER",
      REQUIRE_ACCESS_KEY
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
    // Add request to total and per-IP counter
    CAPTURES_WATCH.currentTotal += 1;

    if (ip in CAPTURES_WATCH.currentByIp) {
      CAPTURES_WATCH.currentByIp[ip] += 1;
    }
    else {
      CAPTURES_WATCH.currentByIp[ip] = 1;
    }

    const tweets = new TwitterCapture(data.url, {runBrowserBehaviors: "unfold-thread" in data});
    const pdf = await tweets.capture();

    successLog.add(REQUIRE_ACCESS_KEY ? accessKey : ip, why, pdf);

    // Generate a filename for the PDF based on url.
    // Example: harvardlil-status-123456789-2022-11-25.pdf
    const filename = (() => {
      const url = new URL(tweets.url);

      let filename = "twitter.com";      
      filename += `${url.pathname}-`;
      filename += `${(new Date()).toISOString().substring(0, 10)}`; // YYYY-MM-DD
      filename = filename.replace(/[^a-z0-9]/gi, "-").toLowerCase();
      return `${filename}.pdf`;
    })();

    return reply
      .code(200)
      .header('Content-Type', 'application/pdf')
      .header('Content-Disposition', `attachment; filename="${filename}"`)
      .send(pdf);
  }
  catch(err) {
    request.log.error(`Capture failed. ${err}`);

    const html = nunjucks.render(`${TEMPLATES_PATH}index.njk`, {
      error: true,
      errorReason: "CAPTURE-ISSUE",
      REQUIRE_ACCESS_KEY
    });

    return reply
      .code(500)
      .header('Content-Type', 'text/html; charset=utf-8')
      .send(html);
  }
  // In any case: we need to decrease CAPTURES_WATCH counts.
  finally {
    CAPTURES_WATCH.currentTotal -= 1;

    if (ip && ip in CAPTURES_WATCH.currentByIp) {
      CAPTURES_WATCH.currentByIp[ip] -= 1;
    }
  }
}

/**
 * [GET] /check
 * Shows the "check" page /check form. Loads certificates history files in the process.
 * Assumes `fastify` is in scope.
 * 
 * @param {fastify.FastifyRequest} request
 * @param {fastify.FastifyReply} reply 
 * @returns {Promise<fastify.FastifyReply>}
 */
 async function check(request, reply) {
  const html = nunjucks.render(`${TEMPLATES_PATH}check.njk`, {
    signingCertsHistory: CertsHistory.load("signing"),
    timestampsCertsHistory: CertsHistory.load("timestamping")
  });

  return reply
    .code(200)
    .header('Content-Type', 'text/html; charset=utf-8')
    .send(html);
}

/**
 * [GET] `/api/v1/hashes/check/<sha512-hash>`. 
 * Checks if a given SHA512 hash is in the "success" logs, meaning this app created it. 
 * Hash is passed as the last parameter, url encoded. 
 * Assumes `fastify` is in scope. 
 * 
 * Returns HTTP 200 if found, HTTP 404 if not. 
 * 
 * @param {fastify.FastifyRequest} request
 * @param {fastify.FastifyReply} reply 
 * @returns {Promise<fastify.FastifyReply>}
 */
async function checkHash(request, reply) {
  let found = false;
  const { hash } = request.params;

  if (hash.length === 95 || hash.length === 88) {
    found = successLog.findHashInLogs(hash);
  }

  return reply.code(found ? 200 : 404).send();
}

