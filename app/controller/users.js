'use strict';
const ErrorRes = require('../lib/errorRes');
const Controller = require('egg').Controller;

class UserController extends Controller {

  /**
   * /users/getData
   * 取得當前使用者資料
   */
  async getData() {
    const { ctx } = this;
    const { request, response, model } = ctx;
    const { Users, Roles } = model;
    if (!ctx.user) throw new ErrorRes(14001, 'Not authenticated', 401);
    console.log(ctx.user);
    let _user = await Users.findOne({
      where: { username: ctx.request.body.userName }
    })
    response.body = _user;
  }

  /**
   * /users/checkEmail
   * 檢查是否 email 已被使用
   */
  async checkEmail() {
    const { ctx } = this;
    const { request, response, model } = ctx;
    // const { Users } = model;
    // Model retrieval
    const _u = await Users.findOne({
      where: { email: request.body.email },
    });
    if (_u) {
      response.body = {
        used: true,
      };
    } else {
      response.body = {
        used: false,
      };
    }
  }

  /**
  * /users/signUp
  * 註冊新會員
  */
  async register() {
    const { ctx } = this;
    const { request, response, model } = ctx;

    const fieldsOK = ctx.service.utils.assertAttrib(request.body, ['username', 'password', 'name', 'telephone', 'email', 'address']);
    if (!fieldsOK) {
      throw new ErrorRes(13001, 'Field validation error', 400);
      console.log('Field validation error');
    }
    const pwhash = await ctx.service.utils.getPasswordHash(request.body.password);
    const newUserData = Object.assign({}, request.body, { pwhash });
    delete newUserData.password;
    const _res = await ctx.model.Users.create(newUserData)
      .then(() => { response.body = "ok"; })
      .catch(err => { response.body = "404\ncheck your attribute(s) is duplicate. "; console.log(err) });

    // response.body = _res;
  }
};

module.exports = UserController;
