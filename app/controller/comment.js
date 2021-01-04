'use strict';

const Controller = require('egg').Controller;

class CommentController extends Controller {

  async create() {
    const { ctx } = this;
    let _err = false;
    // find user's data of token
    const userPayload = await ctx.service.utils.getTokenData(ctx.request.body.userToken);

    //get userID from user's data 
    const user_id = await ctx.model.Users.findOne({ where: { username: userPayload['data']['username'] } })
      .then(res => { return res['dataValues']['id']; })
      .catch(err => { console.log('err1'); ctx.status = 400; ctx.body = err; _err = true; return err; });
    if (_err === true) { return; }

    //check is existed
    const existedRes = await ctx.model.Comment.findOne({ where: { user_id: user_id, items_id: ctx.request.body.goodsId } })
      .then(res => { let existres = (res === null) ? 'no' : 'yes'; return existres; })
      .catch(err => { return 'no'; });
    if (existedRes === 'yes') { ctx.body = 'is existed'; ctx.status = 400; return; }

    // create a new comment
    const res = await ctx.model.Comment.create({
      user_id: user_id,
      items_id: ctx.request.body.goodsId,
      content: ctx.request.body.content,
      user_name: userPayload.data.name
    }).then(res => { return 'ok' })
      .catch(err => { return err });
    if (res === 'ok') { ctx.body = res; ctx.status = 200; return; }
    else { ctx.body = res; ctx.status = 400; console.log(res); return; }

  }
  async findAll() {
    const { ctx } = this;
    let _err = false;
    // console.log('______________find_all___');
    //找comment 所有資料 by goodId
    const res = await ctx.model.Comment.findAll({
      attributes: [['user_id', 'userId'], ['user_name', 'userName'], ['updated_at', 'date'], 'content'],
      where: { items_id: ctx.request.body.goodsId },
    }).then(res => {
      let datalist = [];
      console.log(res);
      for (let i = 0; i < res.length; i++) {
        datalist.push(res[i].dataValues);
      }
      return datalist;
    }).catch(err => {
      _err = true; return err;
    })
    if (_err) { ctx.body = res; ctx.status = 400; console.log(res); return; }
    ctx.body = res;
    ctx.status = 200;

  }


}

module.exports = CommentController;
