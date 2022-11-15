/**
 * archive.social
 * @module const.js
 * @author The Harvard Library Innovation Lab
 * @license MIT
 */

/**
 * Path to the folder holding the certificates used for signing the PDFs.
 * @constant
 */
export const CERTS_PATH = `${process.env.PWD}/certs/`;

/**
 * Path to the folder in which temporary files will be written by the app.
 * @constant
 */
export const TMP_PATH = `${process.env.PWD}/app/tmp/`;

/**
 * Path to the "data" folder.
 */
export const DATA_PATH = `${process.env.PWD}/app/data/`;

/**
 * Path to the "templates" folder.
 */
export const TEMPLATES_PATH = `${process.env.PWD}/app/templates/`;

/**
 * Path to the "executables" folder.
 */
 export const EXECUTABLES_FOLDER = `${process.env.PWD}/executables/`;

/**
 * Path to the "static" folder.
 */
export const STATIC_PATH = `${process.env.PWD}/app/static/`;

/**
 * Maximum capture processes that can be run in parallel.
 */
export const MAX_PARALLEL_CAPTURES_TOTAL = 100;

/**
 * Maximum capture processes that can be run in parallel for a given key.
 */
export const MAX_PARALLEL_CAPTURES_PER_ACCESS_KEY = 2;