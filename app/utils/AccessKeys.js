/**
 * archive.social
 * @module utils.AccessKeys
 * @author The Harvard Library Innovation Lab
 * @license MIT
 */
import assert from "assert";
import fs from "fs";

import { validate as uuidValidate } from 'uuid';

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
   * Frozen hashmap of available access keys 
   * (app needs to be restarted for new keys to be taken into account, for now).
   * @type {object.<string,boolean>}
   */
  #keys = {};

  /**
   * On init:
   * - Create access keys file is it doesn't exist
   * - Load keys from file into `this.#keys`.
   */
  constructor() {
    const filepath = AccessKeys.filepath;

    try {
      const keys = fs.readFileSync(filepath);
      this.#keys = Object.freeze(JSON.parse(keys));
    }
    catch (err) {
      fs.writeFileSync(filepath, "{}");
    }
  }

  /**
   * Checks that a given access key is valid and active.
   * @param {string} accessKey 
   */
  check(accessKey) {
    try {
      assert(uuidValidate(accessKey));
      assert(this.#keys[accessKey] === true);
      return true;
    }
    catch(err) {
      return false;
    }
  }
}