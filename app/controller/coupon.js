'use strict';

const Controller = require('egg').Controller;

class CouponController extends Controller {

 // /coupon/create
  async create() {
    const { ctx } = this;
    let _err = false;
    // create a new coupon
    const res = await ctx.model.Coupon.create({
      content: ctx.request.body.goodsId,
      discount_rate: ctx.request.body.discountContent,
      startdate: ctx.request.startDate,
      enddate: ctx.request.endDate
    }).then(res => { return 'ok' })
      .catch(err => { return err });
    if (res === 'ok') { ctx.body = res; ctx.status = 200; return; }
    else { ctx.body = res; ctx.status = 400; console.log(res); return; }
  }


}

module.exports = CouponController;
