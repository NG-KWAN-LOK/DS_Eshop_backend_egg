'use strict'

const crypto = require('crypto');
const jwt = require('jsonwebtoken')
const Service = require('egg').Service;
const config = require('../../config/config.default.js');

class UtilsService extends Service {
  assertAttrib(obj, keys) {
    let ok = true;
    for (let i = 0; i < keys.length; ++i) {
      if (!obj.hasOwnProperty(keys[i])) ok = false;
    }
    return ok;
  }

  assertAttribMulti(objs, keys) {
    let ok = true;
    for (let i = 0; i < objs.length; ++i) {
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
    const hmac = crypto.createHmac('SHA256', key); //產生一個轉換hash的Hmac物件，用它來轉換text to hash value.
    hmac.update(_toHash);
    const _hash = hmac.digest('hex');  // _hash: 存在Buffer
    return _hash.toString('base64');  //從stream的buffer提出
  }

  /**
   * Generates a hash according to the password and key in config
   * @param {String} password
   * @returns {String} hashString
   */
  async getPasswordHash(password) {
    const { app, config } = this;
    return this.hash(password, app.config.__PWKEY);
  }
  // async getTokenData(token) {
  //   // 
  //   jwt.verify(token, "my_secret_key", (err, data) => {
  //     if (err) { console.log('.........false\n', err); return ({ error: true, res: err }); }
  //     else {
  //       const UserData = Object.assign({}, data['payload']);
  //       console.log('.........true', UserData);
  //       return ("ok");
  //     }
  //   });
  // }
};
module.exports = UtilsService;
