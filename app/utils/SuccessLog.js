/**
 * archive.social
 * @module utils.logCaptureSuccess
 * @author The Harvard Library Innovation Lab
 * @license MIT
 */
import fs from "fs";
import crypto from "crypto";

import { DATA_PATH } from "../const.js";


export class SuccessLog {
  /** 
   * Complete path to `success-log.json`.
   * @type {string} 
   */
  static filepath = `${DATA_PATH}success-log.tsv`;

  /**
   * Adds an entry to `success-log.json`.
   * @param {*} accessKey 
   * @param {Buffer} pdfBytes - Used to store a SHA512 hash of the PDF that was delivered
   */
  static add(accessKey, pdfBytes) {
    // Create file if it does not exist
    if (!fs.existsSync(SuccessLog.filepath)) {
      SuccessLog.reset();
    }

    // Calculate SHA512 hash of the PDF
    const pdfHash = crypto.createHash('sha512').update(pdfBytes).digest('base64');

    // Save entry to file
    const entry = `${new Date().toISOString()}\t${accessKey}\tsha512-${pdfHash}\n`;
    fs.appendFileSync(SuccessLog.filepath, entry);
  }

  /**
   * Resets `success-log.json`.
   */
  static reset() {
    fs.writeFileSync(SuccessLog.filepath, "date-time\taccess-key\thash\n");
  }
}
