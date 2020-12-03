/**
 * Controller
 * - Session Management Routes
 */
'use strict';

const Controller = require('egg').Controller;
const ErrorRes = require('../lib/errorRes');
const users = require('../model/users');

class SessionController extends Controller {
  /*/session/login
  阿就登入啦
  */
 async login(){
  const { ctx } = this;
  const cID = await Users.findOne({
    attributes: {id},
    where:{ name: request.body.userName,}
  });
  const cName = await Users.findOne({
    attributes: {username},
    where:{ name: request.body.userName,}
  });
  console.log('someone is in Ramirez');
  ctx.response.body = {
    userToken: cID ,
    customerName: cName
    }
  }


  /**
   * /session/logout
   * 登出路徑
   * @returns {ActionResult}
   
  async logout() {
    const { ctx, app } = this;
    const { user } = ctx;
    const { redis } = app;

    await redis.srem(`${user.id}:devices`, user.device_uuid);

    ctx.response.body = {
      success: true
    };
  }
*/

};

module.exports = SessionController;