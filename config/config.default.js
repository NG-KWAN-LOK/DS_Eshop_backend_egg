/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1605598991186_6067';

  // add your middleware config here
  config.middleware = [];

  //Encryption keys
  config.__DATAKEY = 'FUCK';
  config.__PWKEY = 'DATABASE';
  config.__HMACKEY = 'SYSTEM';

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  config.security = {
    csrf: {
      enable: false,
    },
  }

  config.sequelize = {
    dialect: 'mysql',
    host: 'us-cdbr-east-02.cleardb.com',
    username: 'b884522f36c7db',
    password: '58f1db46',
    port: 3306,
    database: 'heroku_35bed0e2eedf26e',
  };
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };
  return {
    ...config,
    ...userConfig,
  };
};
