/**
 * thread-keeper
 * @module utils.IPBlockList
 * @author The Harvard Library Innovation Lab
 * @license MIT
 */
import assert from "assert";
import fs from "fs";

import { DATA_PATH } from "../const.js";
  
/** 
 * Utility class for handling the app's IP block list.
 * [!] For alpha launch only.
*/
export class IPBlockList {
  /** 
   * Complete path to `ip-block-list.json`.
   * @type {string} 
   */
  static filepath = `${DATA_PATH}ip-block-list.json`;
 
  /**
   * Frozen hashmap of IPs that need blocking.
   * (app needs to be restarted for new list to be taken into account, for now).
   * @type {object.<string,boolean>}
   */
  #ips = {};
 
  /**
   * On init:
   * - Create access keys file if it doesn't exist
   * - Load IPS from file into `this.#ips`.
   */
  constructor() {
    const filepath = IPBlockList.filepath;

    try {
      const ips = fs.readFileSync(filepath);
      this.#ips = Object.freeze(JSON.parse(ips));
    }
    catch (err) {
      fs.writeFileSync(filepath, "{}");
    }
  }
 
  /**
   * Checks that a IP is on the blocklist and (still) blocked.
   * @param {string} ip 
   */
  check(ip) {
    try {
      assert(ip in this.#ips)
      assert(this.#ips[ip] === true);
      return true;
    }
    catch(err) {
      return false;
    }
   }
 }