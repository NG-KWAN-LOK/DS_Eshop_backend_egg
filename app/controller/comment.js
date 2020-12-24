'use strict';

const Controller = require('egg').Controller;

class CommentController extends Controller {

  async create() {
    const { ctx } = this;
    const userPayload = await ctx.service.utils.getTokenData(ctx.request.body.userToken);
    // console.log(userPayload);
    //get userID from token
    let _err = false;
    const user_id = await ctx.model.Users.findOne({ where: { username: userPayload['data']['username'] } })
      .then(res => { return res['dataValues']['id']; })
      .catch(err => { console.log('err1'); ctx.status = 400; ctx.body = err; _err = true; return err; });
    if (_err === true) { return; }
    const res = await ctx.model.Comment.create({
      user_id: user_id,
      items_id: ctx.request.body.goodsId,
      content: ctx.request.body.content,
    }).then(res => { return 'ok' })
      .catch(err => { return err });
    if (res === 'ok') { ctx.body = res; ctx.status = 200; return; }
    else { ctx.body = res; ctx.status = 400; console.log(res); return; }

  }



}

module.exports = CommentController;
