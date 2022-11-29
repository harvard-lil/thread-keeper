/**
 * thread-keeper
 * @module const
 * @author The Harvard Library Innovation Lab
 * @license MIT
 */
import fs from "fs";

/**
 * Path to the folder holding the certificates used for signing the PDFs.
 * Defaults to `./certs`
 * Can be replaced via the `CERTS_PATH` env variable.
 * @constant
 */
export const CERTS_PATH = process.env.CERTS_PATH ? process.env.CERTS_PATH : `${process.env.PWD}/certs/`;

/**
 * Path to the "data" folder.
 * Defaults to `./app/data`
 * Can be replaced via the `DATA_PATH` env variable.
 * @constant
 */
export const DATA_PATH = process.env.DATA_PATH ? process.env.DATA_PATH : `${process.env.PWD}/app/data/`;

/**
 * Path to the folder in which temporary files will be written by the app.
 * @constant
 */
export const TMP_PATH = `${process.env.PWD}/app/tmp/`;

/**
 * Path to the "templates" folder.
 * @constant
 */
export const TEMPLATES_PATH = `${process.env.PWD}/app/templates/`;

/**
 * Path to the "executables" folder, for dependencies that are meant to be executed directly, such as `yt-dlp`.
 * @constant
 */
export const EXECUTABLES_FOLDER = `${process.env.PWD}/executables/`;

/**
 * Path to the "static" folder.
 * @constant
 */
export const STATIC_PATH = `${process.env.PWD}/app/static/`;

/**
 * If `true`, users will be required to provide an access key.
 * Defaults to `false`.
 * Can be replaced via the `REQUIRE_ACCESS_KEY` env variable, if set to "1".
 * @constant
 */
export const REQUIRE_ACCESS_KEY = process.env.REQUIRE_ACCESS_KEY === "1" ? true : false;

/**
 * Maximum capture processes that can be run in parallel.
 * Defaults to 50.
 * Can be replaced via the `MAX_PARALLEL_CAPTURES_TOTAL` env variable.
 * @constant
 */
export const MAX_PARALLEL_CAPTURES_TOTAL = (() => {
  const fromEnv = parseInt(process.env.MAX_PARALLEL_CAPTURES_TOTAL);
  
  if (!isNaN(fromEnv) && fromEnv > 0) {
    return fromEnv;
  }
  else {
    return 50;
  }
})();

/**
 * Maximum capture processes that can be run in parallel for a given IP address.
 * Defaults to:
 * - 2 if REQUIRE_ACCESS_KEY is `false`
 * - 10 if REQUIRE_ACCESS_KEY is `true`
 * Can be replaced via the `MAX_PARALLEL_CAPTURES_PER_IP` env variable.
 * @constant
 */
export const MAX_PARALLEL_CAPTURES_PER_IP = (() => {
  const fromEnv = parseInt(process.env.MAX_PARALLEL_CAPTURES_PER_IP);
  
  if (!isNaN(fromEnv) && fromEnv > 0) {
    return fromEnv;
  }
  else {
    return REQUIRE_ACCESS_KEY ? 10 : 2;
  }
})();

/**
 * APP version. Pulled from `package.json` by default.
 * @constant
 */
export const APP_VERSION = (() => {
  const appPackage = JSON.parse(fs.readFileSync("./package.json"));
  return appPackage?.version ? appPackage.version : "0.0.0";
})();
