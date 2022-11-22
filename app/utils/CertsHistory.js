/**
 * thread-keeper
 * @module utils.CertsHistory
 * @author The Harvard Library Innovation Lab
 * @license MIT
 */
 import fs from "fs";
 
 import { DATA_PATH } from "../const.js";
 
 /**
  * Utility class for handling the "certificates history" files.
  * Expected structure:
  * ```
  * [
  *   {
  *     "from": "2022-11-18 13:07:56 UTC",
  *     "to": "2022-11-22 19:00:00 UTC",
  *     "domain": "domain.ext",
  *     "info": "...",
  *     "cert": "..."
  *   },
  *   ...
  * ]
  * ```
  */
 export class CertsHistory {
   /** 
    * Complete path to `signing-certs-history.json`.
    * @type {string} 
    */
  static signingFilepath = `${DATA_PATH}signing-certs-history.json`;

  /** 
   * Complete path to `timestamping-certs-history.json`.
   * @type {string} 
   */
  static timestampingFilepath = `${DATA_PATH}timestamping-certs-history.json`;

  /**
   * Returns the parsed contents of a certificates history file.
   * Creates said file if it doesn't exist.
   * 
   * @param {string} [type="signing"] - Can be "signing" or "timestamping". 
   */
  static load(type = "signing") {
    if (!["signing", "timestamping"].includes(type)) {
      throw new Error(`${type} is not a valid certificate history file type.`);
    }

    const filepath = type === "signing" ? CertsHistory.signingFilepath : CertsHistory.timestampingFilepath;

    if (!fs.readFileSync(filepath)) {
      fs.writeFileSync(filepath, "{}");
    }

    return JSON.parse(fs.readFileSync(filepath));
  }
 }
 