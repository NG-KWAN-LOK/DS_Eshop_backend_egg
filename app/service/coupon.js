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

    async ModifyCoupon(couponID,NewData) {
        const { ctx } = this;
        let result;
        await ctx.model.Users.findByPk(couponID)
            .then((foundCoupon) => {
            result = 'ok';
            foundCoupon.update({
                couponName : ctx.request.body.NewcouponName,
                description:ctx.request.body.Newdescription,
                discount_rate : ctx.request.body.NewdiscountContent,
                startdate : ctx.request.NewstartDate,
                enddate : ctx.request.NewendDate
            });
            })
            .catch(err => { result = err; });
    return result;
    }
}

module.exports = CouponService;
