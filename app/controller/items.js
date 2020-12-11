'use strict';

const Controller = require('egg').Controller;

class ItemsController extends Controller {
    async create() {
        const { ctx, model } = this;
        const itemData = {
            "name": ctx.request.body.name,
            "description": ctx.request.body.description,
            "image_url": ctx.request.body.imgURL,
            "price": ctx.request.body.price,
            "remain_quantity": ctx.request.body.stock,
            "is_Display": ctx.request.body.is_Display
        };
        const userToken = ctx.request.body.userToken;
        //const res = await ctx.service.items.createItems(itemData, userToken);
        const userData = await ctx.service.utils.getTokenData(userToken);
        console.log('...........y', userData);
        if (userData) {
            ctx.status = 200;
            ctx.body = userData;
            //ctx.body = "ok";
        }
        else {
            ctx.body = "some error";
        }
    }
}

module.exports = ItemsController;
