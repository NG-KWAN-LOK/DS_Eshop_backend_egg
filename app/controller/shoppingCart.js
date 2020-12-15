'use strict';

const Controller = require('egg').Controller;

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
        const result = await ShoppingCart.findAll({
            where: { user_id: user_id },
            group: 'seller_id',
            order: ['updatedAt', 'DESC'],
        })
        console.log(result);
        ctx.body = result;
        ctx.status = 200;

    }
}

module.exports = ShoppingCartController;
