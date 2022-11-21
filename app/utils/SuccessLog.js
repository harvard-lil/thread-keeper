/**
 * archive.social
 * @module utils.SuccessLog
 * @author The Harvard Library Innovation Lab
 * @license MIT
 */
import fs from "fs";
import readline from "node:readline";
import crypto from "crypto";

import { DATA_PATH } from "../const.js";


export class SuccessLog {
  /** 
   * Complete path to `success-log.json`.
   * @type {string} 
   */
  static filepath = `${DATA_PATH}success-log.tsv`;

  /**
   * Hashmap of all the sha512 hashes present in the current log file.
   * Used for fast lookups. 
   *
   * @type {object.<string, boolean>}
   */
  #hashes = {};

  /**
   * On init:
   * - Create log file if it doesn't exist
   * - Load hashes from file into `this.#hashes`.
   */
  constructor() {
    const filepath = SuccessLog.filepath;

    // Create file if it does not exist
    if (!fs.existsSync(filepath)) {
      this.reset();
    }

    // Load hashes from existing file into hashmap (asynchronous)
    const readLogs = readline.createInterface({
      input: fs.createReadStream(filepath),
      crlfDelay: Infinity
    });

    readLogs.on("line", (line) => {
      // Skip lines that are not log lines
      if (line[0] === "d" || line[0] === "\n") {
        return;
      }

      // Grab last 95 chars of line, check it's a sha512 hash, add to #hashes.
      const lineLength = line.length;
      const hash = line.substring(lineLength - 95);

      if (hash.length === 95 && hash.startsWith("sha512-")) {
        this.#hashes[hash] = true;
      }
    });
    
  }

  /**
   * Calculates hash of a PDF an:
   * - Creates a success log entry
   * - Updates `this.#hashes` (so it doesn't need to reload from file)
   * 
   * @param {string} accessKey 
   * @param {Buffer} pdfBytes - Used to store a SHA512 hash of the PDF that was delivered
   */
  add(accessKey, pdfBytes) {
    // Calculate SHA512 hash of the PDF
    const hash = crypto.createHash('sha512').update(pdfBytes).digest('base64');

    // Save entry
    const entry = `${new Date().toISOString()}\t${accessKey}\tsha512-${hash}\n`;
    fs.appendFileSync(SuccessLog.filepath, entry);
    this.#hashes[`sha512-${hash}`] = true;
  }

  /**
   * Checks whether or not a given hash is present in the logs.
   * @param {string} hash 
   * @returns {boolean}
   */
  findHashInLogs(hash) {
    hash = String(hash);

    // Compensate for the absence of "sha512-"
    if (hash.length === 88) {
      hash = `sha512-${hash}`;
    }
    
    if (hash.length < 95) {
      return false;
    }

    return hash in this.#hashes && this.#hashes[hash] === true;
  }

  /**
   * Resets `success-log.json`.
   * Also clears `this.#hashes`.
   * @returns {void}
   */
  reset() {
    fs.writeFileSync(SuccessLog.filepath, "date-time\taccess-key\thash\n");
    this.#hashes = {};
  }
}
