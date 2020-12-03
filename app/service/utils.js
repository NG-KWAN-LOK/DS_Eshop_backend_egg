'use strict'

const crypto = require('crypto');

const Service = require('egg').Service;

class UtilsService extends Service{
    assertAttrib(obj, keys) {
        let ok = true;
        for (let i = 0; i < keys.length; ++i ) {
          if (!obj.hasOwnProperty(keys[i])) ok = false;
        }
        return ok;
      }
    
    assertAttribMulti(objs, keys) {
        let ok = true;
        for (let i = 0; i < objs.length; ++i ) {
          ok = this.assertAttrib(objs[i], keys);
        }
        return ok;
      }
    
 /**
   * Generate a hash for whatever data passed into it
   * @param {*} toHash
   * @param {String} key
   * @returns {String} hashString
   */
  hash(toHash, key) {
    let _toHash;
    // Determine if string
    if (typeof toHash == 'string') {
      _toHash = toHash;
    } else {
      // Is Object
      _toHash = JSON.stringify(toHash);
    }
    const hmac = crypto.createHmac('SHA256', key);
    hmac.update(_toHash);
    const _hash = hmac.digest('hex');  // _hash: Buffer
    return _hash.toString('base64');
  }

  /**
   * Generates a hash according to the password and key in config
   * @param {String} password
   * @returns {String} hashString
   */
  async getPasswordHash(password) {
    const { app } = this;
    return this.hash(password, app.config.__PWKEY);
  };
};
module.exports=UtilsService;
