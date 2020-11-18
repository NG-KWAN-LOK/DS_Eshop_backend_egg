/**
 * Controller
 * - Session Management Routes
 */
'use strict';

const Controller = require('egg').Controller;
const ErrorRes = require('../lib/errorRes');

class SessionController extends Controller {
  /**
   * /users/logout
   * 登出路徑
   * @returns {ActionResult}
   */
  async logout() {
    const { ctx, app } = this;
    const { user } = ctx;
    const { redis } = app;

    await redis.srem(`${user.id}:devices`, user.device_uuid);

    ctx.response.body = {
      success: true
    };
  }

  /**
   * /session/register
   * 註冊新會員
   */
  async register() {

  }
};

module.exports = SessionController;