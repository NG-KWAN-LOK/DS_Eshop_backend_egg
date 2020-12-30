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
      description: ctx.request.body.description,
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
      description:ctx.request.body.Newdescription,
      discount_rate : ctx.request.body.NewdiscountContent,
      startdate : ctx.request.NewstartDate,
      enddate : ctx.request.NewendDate
    };
    let result;
    console.log('changing coupon');
    const couponID = await ctx.service.coupon.getID(request.body.couponName);
    await ctx.model.Coupon.findOne({where: {id : couponID}})
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

  async getAll(){
    const {ctx} = this;
    const {response} = ctx;
    const {Coupon} = ctx.model;
    console.log('Fetching all coupon');
    const couponList = await ctx.model.Coupon.findAll();
    ctx.body = couponList;
    ctx.status = 200;
  }

  async getbycontent(){
    const {ctx} = this;
    const {request,response} = ctx;
    console.log('searching by coupon content(name)');
    const result = await ctx.model.Coupon.findOne({where: {content: request.body.couponName}});
    ctx.body = result;
    ctx.status = 200;
  }
}

module.exports = CouponController;
