/**
 * thread-keeper
 * @module const.js
 * @author The Harvard Library Innovation Lab
 * @license MIT
 */

/**
 * Path to the folder holding the certificates used for signing the PDFs.
 * @constant
 */
export const CERTS_PATH = process.env.CERTS_PATH ? process.env.CERTS_PATH : `${process.env.PWD}/certs/`;

/**
 * Path to the "data" folder.
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
 * Maximum capture processes that can be run in parallel.
 * @constant
 */
export const MAX_PARALLEL_CAPTURES_TOTAL = 200;

/**
 * Maximum capture processes that can be run in parallel for a given key.
 * @constant
 */
export const MAX_PARALLEL_CAPTURES_PER_ACCESS_KEY = 20;