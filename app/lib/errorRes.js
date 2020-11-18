/**
 * @class ErrorRes
 * Error Response
 * Refactored 2019
 */
'use strict';

class ErrorRes extends Error {
  constructor(code, message, status = 400, data = null) {
    let msg = '';
    if (typeof message === 'object') msg = message.message || JSON.stringify(message);
    else msg = message;
    super(msg);

    /**
     * @name ErrorRes#statusCode
     * @type Number
     * @description
     * 10000~19999 Client Error
     * 20000~      Server Error
     * @example 10001
     */
    this.code = code;
    this.statusCode = status;
    this.status = status;

    /**
      @name ErrorRes#message
      @type String
      @description Error Info
      @example 'User Not Found'
    */
    this._message = msg; // this is for compatibility
    this.message = msg;

    /**
      @name ErrorRes#data
      @type Object
      @description Detailed Error Information
    */
    let errorData = null;
    if (typeof message === 'object') errorData = data || message;
    else errorData = data;
    this.data = errorData;
    
  };

};

module.exports = ErrorRes;
