'use strict';
const ErrorRes = require('../lib/errorRes');
const Controller = require('egg').Controller;
const jwt = require('jsonwebtoken');

class UserController extends Controller {

  /**
   * /users/getData
   * 取得當前使用者資料
   */
  async getData() {
    const { ctx } = this;
    const { request, response, model } = ctx;
    const { Users} = model;
    let findedUsername;
    let userData;
    let findedUserID;
    const userToken = ctx.request.body.userToken;
    jwt.verify(userToken, "my_secret_key", (err, data) => {
        if (err) { console.log('faild retrieve token', err); ctx.body = "404 for retrieve usertoken"; return; }
        else {
            userData = Object.assign({}, data['payload']);
            findedUsername = userData['username'];
            //console.log('payload', data['payload']);
        }
    });
    if (findedUsername != null) {
        await model.Users.findOne({ where: { username: findedUsername } })
            .then(findedUser => {
                findedUserID = findedUser['dataValues']['id'];
                console.log('Userid is finded: ', findedUserID);
                return;
            })
            .catch(err => {
                console.log(err);
                ctx.status = 400;
                ctx.body = '404 for not find user';
                return;
            });
    }
    else {
        ctx.status = 400;
        ctx.body = "not find the user, contact with backend";
        console.log('usename is ::::', findedUsername);
    }
    const _user = await Users.findOne({where: {username: findedUsername}});
    const res = {
        "userName" : findedUsername,
        "customerName": _user.name,
        "phoneNumber": _user.telephone,
        "email": _user.email,
        "address": _user.address
    };
    ctx.body = Object.assign(res);
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
