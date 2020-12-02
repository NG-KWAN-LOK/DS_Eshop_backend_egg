'use strict';
const ErrorRes = require('../lib/errorRes');
const Controller = require('egg').Controller;

class UserController extends Controller {

  /**
   * /users/info
   * 取得當前使用者資料
   */
  async info() {
    const { ctx } = this;
    const { request, response, model } = ctx;
    // const { Users, Roles, Permissions } = model;
    if (!ctx.user) throw new ErrorRes(14001, 'Not authenticated', 401);
    console.log(ctx.user);
    let _user = await Users.findByPk(ctx.user.id, {
      attributes: {
        exclude: ['password']
      },
      plain: true,
      include: [
        {
          model: Roles,
          as: 'roles',
          include: [
            {
              model: Permissions,
              as: 'permissions'
            }
          ]
        }
      ]
    });
    _user.role = {};
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
  async test() {
    const { ctx, model } = this;
    const { shop } = model;
    ctx.body = { "姓名": "宗翰", "電話": "09xxxxxx" };
  }
  /**
 * /users/signUp
 * 註冊新會員
 */
  async register() {
    const { ctx } = this;
    const { request, response, model } = ctx;
    // const { Users } = model;

    //const fieldsOK = ctx.service.utils.assertAttrib(request.body, ['userName', 'password', 'customerName', 'phoneNumber', 'email', 'address']);
    //if (!fieldsOK) throw new ErrorRes(13001, 'Field validation error', 400);
    const _res = await ctx.model.Users.create(request.body)
      .then(() => { response.body = "ok"; })
      .catch(err => { response.body = "404"; console.log(err) });

    // response.body = _res;
  }
};

module.exports = UserController;
