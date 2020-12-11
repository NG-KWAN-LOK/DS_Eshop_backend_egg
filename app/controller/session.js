/**
 * Controller
 * - Session Management Routes
 */
'use strict';

const Controller = require('egg').Controller;
const ErrorRes = require('../lib/errorRes');
const users = require('../model/users');
const jwt = require('jsonwebtoken')
class SessionController extends Controller {
  /*/session/login
  阿就登入啦
  */
  async login() {
    const { ctx, config } = this;
    const { request } = ctx;
    const { Users } = ctx.model;
    let _compareRes = false;
    console.log('............username: ', ctx.request.body.userName);
    console.log('............pwd: ', ctx.request.body.password);
    const _res = await Users.findOne({
      where: { username: ctx.request.body.userName }
    })
      .catch((err) => {
        console.log('\n...............Error', err);
        ctx.body = 'can not find user'
      });
    const user = _res['dataValues'];
    console.log('\n..............', user);
    const userPwdHash = await ctx.service.utils.getPasswordHash(ctx.request.body.password);
    if (userPwdHash === user.pwhash) {
      const payload = {
        user_name: user.name,
        user_email: user.email,
        exp: Math.floor(Date.now() / 1000) + (60 * 15)
      }
      const token = jwt.sign({ payload }, "my_secret_key");
      console.log(token);
      const res = {
        "userToken": token,
        "userName": user.username,
        "customerName": user.name,
        "phoneNumber": user.telephone,
        "email": user.email,
        "address": user.address
      }
      ctx.code = 200;
      ctx.body = (Object.assign(res));
      console.log(user.name, ' is login');
    } else {
      console.log('密碼錯誤');
      console.log('before: ', user.pwhash);
      console.log('before: ', userPwdHash);
      ctx.body = '密碼錯誤';
      ctx.code = 401;
    }
  }

  /**session/isloggedin */
  async IsloggedIn(){
    const {ctx} = this;
    const {request,response,model} = ctx;
    const {Users} = model;
    if (!ctx.user) {response.body=false} else {response.body =true;} 
  }

  /** 檢查登入狀態 */
  async loginTrigger(){
    const {ctx} = this;
    const {request,response} = ctx;
    
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