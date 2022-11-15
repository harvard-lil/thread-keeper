/**
 * archive.social
 * @module utils.AccessKeys
 * @author The Harvard Library Innovation Lab
 * @license MIT
 */
 import fs from "fs";

 import { DATA_PATH } from "../const.js";
 
/**
 * Utility class for handling access keys to the app.
 * [!] Needs replacement.
 */
export class AccessKeys {

  /** 
   * Complete path to `access-keys.json`.
   * @type {string} 
   */
  static filepath = `${DATA_PATH}access-keys.json`;

  /**
   * Tries to load access keys hashmap from disk. 
   * Creates empty file if none provided.
   * 
   * @returns {object} - Frozen object
   */
  static fetch() {
    const filepath = AccessKeys.filepath;

    try {
      const keys = fs.readFileSync(filepath);
      return Object.freeze(JSON.parse(keys));
    }
    catch (err) {
      fs.writeFileSync(filepath, "{}");
    }
  }
}