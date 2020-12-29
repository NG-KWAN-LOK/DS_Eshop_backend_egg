'use strict';

const Controller = require('egg').Controller;
const ErrorRes = require('../lib/errorRes');

class CouponController extends Controller {

 // /coupon/create
  async create() {
    const { ctx } = this;
    // create a new coupon
    const res = await ctx.model.Coupon.create({
      content: ctx.request.body.couponName,
      discount_rate: ctx.request.body.discountContent,
      startdate: ctx.request.startDate,
      enddate: ctx.request.endDate
    }).then(res => { return 'ok' })
      .catch(err => { return err });
    if (res === 'ok') { ctx.body = res; ctx.status = 200; return; }
    else { ctx.body = res; ctx.status = 400; console.log(res); return; }
  }

  async Modify(){
    const {ctx} = this;
    const {request,response} = ctx;
    const NewData = {
      couponName : ctx.request.body.NewcouponName,
      discount_rate : ctx.request.body.discountContent,
      startdate : ctx.request.startDate,
      enddate : ctx.request.endDate
    };
    let result;
    console.log('changing coupon');
    await ctx.model.Coupon.findByPk(request.body.couponName)
      .then((foundCoupon) => {
        result = 'ok';
          foundCoupon.update({NewData});
      })
    .catch(err => { result = err; });
    if (result==='ok'){
      const res = NewData;
      ctx.body = res;
      ctx.status = 200;
    } else {
      throw new ErrorRes(15001, 'Input or server error, please check your request or contact backend', 400);  
    }
  }
}

module.exports = CouponController;
