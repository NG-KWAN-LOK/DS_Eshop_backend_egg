'use strict';
const ErrorRes = require('../lib/errorRes');
const Controller = require('egg').Controller;

class UserController extends Controller {
  /**
   * /users/create
   * 建立使用者
   */
  async create() {
    const { ctx } = this;
    const { request, response, model } = ctx;
    const { Users, Roles } = model;
    // 1. Data validation
    const fieldsOK = ctx.service.utils.assertAttrib(request.body, [ 'email', 'name', 'password' ]);
    if (!fieldsOK) throw new ErrorRes(13001, 'Field validation error', 400);
    // 2. Password hash generation
    const pwHash = await ctx.service.utils.getPasswordHash(user.password);
    const newUserData = Object.assign({}, request.body, { pwHash });
    delete newUserData.password;
    const _res = await model.Users.create(newUserData);
    response.body = _res;
  };

  /**
   * /users/listRoles
   * 列出所有角色資料
   */
  async listRoles() {
    const { ctx } = this;
    const { request, response, model } = ctx;
    const { Users, Roles } = model;
    // 1. Access control
    if (!ctx.user) throw new ErrorRes(14001, 'Not authenticated', 401);
    // 2. Data retrieval
    const res = await Roles.findAll({
      order: [
        ['description', 'DESC']
      ]
    });
    response.body = res;
  }

  /**
   * /users/assignRoles
   * 指定角色給使用者
   */
  async assignRoles() {
    const { ctx } = this;
    const { request, response, model } = ctx;
    const { Users, Roles, RoleUserMaps } = model;
    if (!request.body.hasOwnProperty('roles')) throw new ErrorRes(13001, 'Data insufficient', 400);
    // 1. Access control
    if (!ctx.user) throw new ErrorRes(14001, 'Not authenticated', 401);
    let { roles } = await Users.findAll({ plain: true, where: { id: ctx.user.id }, include: { model: Roles, as: 'roles', } });
    const allowedRoles = ['admin', 'moderator', 'corporate', 'operator'];
    let modifyingOthers = request.body.hasOwnProperty('user_id') && request.body['user_id'] != ctx.user.id;
    for (let i = 0; i < roles.length; ++i ) if (modifyingOthers && (allowedRoles.indexOf(roles[i].description) === -1)) throw new ErrorRes(14002, 'Action blocked for user group', 401);
    // 2. Data insertion by description
    const addedMaps = [];
    for (let i = 0; i < request.body.roles.length; ++i) {
      const targetRole = await Roles.findOne({
        where: {
          description: request.body.roles[i]
        }
      });
      if (!targetRole) break;
      const newMap = await RoleUserMaps.create({
        user_id: modifyingOthers ? request.body.user_id : ctx.user.id,
        role_id: targetRole.id
      });
      addedMaps.push(newMap);
    }
    response.body = addedMaps;
  }

  /**
   * /users/removeRoles
   * 為使用者移除角色
   */
  async removeRoles() {
    const { ctx } = this;
    const { request, response, model } = ctx;
    const { Users, Roles, RoleUserMaps } = model;
    if (!request.body.hasOwnProperty('roles')) throw new ErrorRes(13001, 'Data insufficient', 400);
    // 1. Access control
    if (!ctx.user) throw new ErrorRes(14001, 'Not authenticated', 401);
    let { roles } = await Users.findAll({ plain: true, where: { id: ctx.user.id }, include: { model: Roles, as: 'roles', } });
    const allowedRoles = ['admin', 'moderator', 'corporate', 'operator'];
    let modifyingOthers = request.body.hasOwnProperty('user_id') && request.body['user_id'] != ctx.user.id;
    for (let i = 0; i < roles.length; ++i ) if (modifyingOthers && (allowedRoles.indexOf(roles[i].description) === -1)) throw new ErrorRes(14002, 'Action blocked for user group', 401);
    // 2. Data manipulation by description
    const removedMaps = [];
    for (let i = 0; i < request.body.roles.length; ++i) {
      const targetRole = await Roles.findOne({
        where: {
          description: request.body.roles[i]
        }
      });
      if (!targetRole) break;
      const targetMap = await RoleUserMaps.findOne({
        where: {
          user_id: modifyingOthers ? request.body.user_id : ctx.user.id,
          role_id: targetRole.id
        }
      });
      await targetMap.destroy();
      removedMaps.push(targetMap);
    }
    response.body = removedMaps;
  }

  /**
   * /users/retrieve
   * 取得使用者資料
   */
  async retrieve() {
    const { ctx } = this;
    const { request, response, model } = ctx;
    if (!ctx.user) throw new ErrorRes(14001, 'Not authenticated', 401);
    // Data retrieval
    if (!request.body) {
      const _user = await model.Users.findOne({
        id: ctx.user.id,
        attributes: {
          exclude: [ 'pwHash' ]
        },
      });
      console.log(_user);
      response.body = _user;
    } else {
      response.body = await model.Users.findOne({
        attributes: {
          exclude: [ 'pwHash' ]
        },
        ...request.body
      });
    }
  }

  /**
   * /users/info
   * 取得當前使用者資料
   */
  async info() {
    const { ctx } = this;
    const { request, response, model } = ctx;
    const { Users, Roles, Permissions } = model;
    if (!ctx.user) throw new ErrorRes(14001, 'Not authenticated', 401);
    console.log(ctx.user);
    let _user = await Users.findByPk(ctx.user.id, {
      attributes: {
        exclude: [ 'pwHash' ]
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
    const { Users } = model;
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
   * /users/list
   * ADMIN: 列出使用者
   */
  async list() {
    const { ctx } = this;
    const { request, response, model } = ctx;
    const { Users, Roles, } = model;
    // 1. Access control
    if (!ctx.user) throw new ErrorRes(14001, 'Not authenticated', 401);
    let { roles } = await Users.findAll({ plain: true, where: { id: ctx.user.id }, include: { model: Roles, as: 'roles', } });
    const allowedRoles = ['admin', 'moderator',];
    for (let i = 0; i < roles.length; ++i ) if (allowedRoles.indexOf(roles[i].description) === -1) throw new ErrorRes(14002, 'Action blocked for user group', 401);
    // 2. Model retrieval
    const res = await Users.findAll({ where: { ...request.body }, attributes: {
      exclude: [ 'status', 'pwHash', 'username', 'creator_id', 'company_id', 'group_id', 'last_login_ip', 'is_online', 'avatar' ]
    }, });
    response.body = res;
  }

  /**
   * /users/count
   * ADMIN: 使用者數量
   */
  async count() {
    const { ctx } = this;
    const { request, response, model } = ctx;
    const { Users, Roles, } = model;
    // 1. Access control
    if (!ctx.user) throw new ErrorRes(14001, 'Not authenticated', 401);
    let { roles } = await Users.findAll({ plain: true, where: { id: ctx.user.id }, include: { model: Roles, as: 'roles', } });
    const allowedRoles = ['admin', 'moderator',];
    for (let i = 0; i < roles.length; ++i ) if (allowedRoles.indexOf(roles[i].description) === -1) throw new ErrorRes(14002, 'Action blocked for user group', 401);
    // 2. Model retrieval
    const res = await Users.count({ where: { ...request.body } });
    response.body = res;
  }

    /**
   * /user/register
   * 註冊新會員
   */
  async register() {
    const { ctx } = this;
    const { request, response, model } = ctx;
    const { Users} = model;
    const fieldsOK = ctx.service.utils.assertAttrib(request.body, ['userName', 'password','customerName','phoneNumber','email','address']);
    if (!fieldsOK) throw new ErrorRes(13001, 'Field validation error', 400);
    const _res = await model.Users.create(request.body);
    response.body= _res;
  }
};

module.exports = UserController;
