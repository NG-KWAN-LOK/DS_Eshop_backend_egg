'use strict';

const Service = require('egg').Service;

class CouponService extends Service {
    async getID(couponToGet){
        const {ctx} = this;
        let result;
        result = await ctx.model.Coupon.findOne({where: {content : couponToGet}});
        console.log(result);
        const couponID = result['dataValues']['id'];
        return couponID;
    }

}

module.exports = CouponService;
