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
    const { Users } = model;
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
    const _user = await Users.findOne({ where: { username: findedUsername } });
    const res = {
      "userName": findedUsername,
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

  async ModifyData() {
    const { ctx } = this;
    const { request, response } = ctx;
    const usertoken = ctx.request.body.userToken;
    const NewData = {
      customerName: request.body.customerName,
      phoneNumber: request.body.phoneNumber,
      email: request.body.email,
      address: request.body.address
    };
    let sumtingwong = false;
    console.log('Enter');
    // Extract token data 
    const userData = await ctx.service.utils.getTokenData(usertoken)
    const user_id = await ctx.model.Users.findOne({ where: { username: userData['data']['username'] } })
      .then(res => { return res['dataValues']['id']; })
      .catch(err => { console.log('err1'); ctx.status = 400; ctx.body = err; sumtingwong = true; return err; });
    if (sumtingwong === true) { return; }
    const result = await ctx.service.user.ChangeInfo(user_id, NewData);
    if (result === 'ok') {
      const res = NewData;
      ctx.body = res;
      ctx.status = 200;
    } else {
      throw new ErrorRes(15001, 'Input or server error, please check your request or contact backend', 400);
    }
  }

  async getNamesByID() {
    const { ctx } = this;
    const { request } = ctx;
    const user_id = ctx.request.body.userId;
    // const userData = await ctx.service.utils.getTokenData(usertoken)
    // const user_id = await ctx.model.Users.findOne({ where: { username: userData['data']['username'] } })
    //   .then(res => { return res['dataValues']['id']; })
    const result = await ctx.model.Users.findByPk(user_id)
      .catch(err => { throw new ErrorRes(13001, err, 400) });
    const username = result['dataValues']['name'];
    const customerName = result['dataValues']['username'];
    const res = { username, customerName };
    ctx.body = res;
    ctx.status = 200;
  }

};

module.exports = UserController;
