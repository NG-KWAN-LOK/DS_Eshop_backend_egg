'use strict';

const Controller = require('egg').Controller;
const ErrorRes = require('../lib/errorRes');

class ShoppingCartController extends Controller {
    async getCartAll() {
        const { ctx } = this;
        const { ShoppingCart } = ctx.model;
        let userPayload, user_id;
        const usertoken = ctx.request.body.userToken;

        // Get user's token payload 
        const userData = await ctx.service.utils.getTokenData(usertoken)
            .catch((err) => { throw new ErrorRes(13001, err, 400); });
        if (userData.error === "ok") { userPayload = userData.data; }
        else { throw new ErrorRes(13001, userData.data, 400); }

        // use username finded by token get user's ID.
        user_id = await ctx.service.user.getUserID(userPayload.username);
        // console.log('finded userid is : ', user_id);

        // find all user's item in shoppingCart
        const res = await ShoppingCart.findAll({
            where: { user_id: user_id },
            // group: 'seller_id',
            // order: ['updated_at', 'DESC'],
        }).then(res => {
            ctx.status = 200;
            return res;
        }).catch(err => { ctx.status = 400; return err; });
        ctx.body = res;

    }
    async addItemtoCart() {
        const { ctx } = this;
        const { ShoppingCart } = ctx.model;
        let userPayload;
        const usertoken = ctx.request.body.userToken;
        // Get user's token payload 
        const userData = await ctx.service.utils.getTokenData(usertoken)
            .catch((err) => { throw new ErrorRes(13001, err, 400); });
        if (userData.error === "ok") { userPayload = userData.data; }
        else { throw new ErrorRes(13001, userData.data, 400); }

        // use username finded by token get user's ID.
        const user_id = await ctx.service.user.getUserID(userPayload.username);
        const goodInfo = await ctx.service.items.getItemsInfo(ctx.request.body.goodId);
        const result = await ctx.service.shoppingCart.addGoods(user_id, ctx.request.body.count, goodInfo.data);

        if (result === 'ok') {
            console.log('result is :', result);
            ctx.body = result;
            ctx.status = 200;

        }
        else { console.log('error is :', result); ctx.status = 400; ctx.body = 'add goods error'; }
    }
    async reduceGoodsAmount() {
        const { ctx } = this;
        const usertoken = ctx.request.body.userToken;
        let userPayload;
        console.log('Enter');
        // Get user's token payload 
        const userData = await ctx.service.utils.getTokenData(usertoken)
            .catch((err) => { ctx.status = 400; ctx.body = err; });
        if (userData.error === "ok") { userPayload = userData.data; }
        else { ctx.status = 400; ctx.body = err; return; }

        // use username finded by token get user's ID.
        const user_id = await ctx.service.user.getUserID(userPayload.username);
        const result = await ctx.service.shoppingCart.reduceGoods(user_id, 1, ctx.request.body.goodId)
            .then(res => { if (res === 'ok') { ctx.status = 200; } else { return res; } })
            .catch(err => { ctx.status = 400; return err; });
        ctx.body = result;
    }
}

module.exports = ShoppingCartController;
