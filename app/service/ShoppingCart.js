'use strict';

const Service = require('egg').Service;
const ErrorRes = require('../lib/errorRes');

class ShoppingCartService extends Service {
    async addGoods(consumerID, quantity, goodInfo) {
        const { ctx } = this;
        const { ShoppingCart } = ctx.model;
        console.log("goodeInfo is : ", goodInfo);
        const seller_name = await ctx.service.user.getNameByID(goodInfo.user_id);
        // console.log('info is : ', goodInfo);
        const res = await ctx.model.ShoppingCart.create({
            "quantity": quantity,
            "user_id": consumerID,
            "seller_id": goodInfo.user_id,
            "seller_name": seller_name,
            "items_id": goodInfo.id,
            "itemsSub_Id": goodInfo.sub_id,
            "items_name": goodInfo.name,
            "items_image_url": goodInfo.image_url

        })
            .catch(err => { console.log('add goods error', err); return err; });
        return 'ok';
    }
}

module.exports = ShoppingCartService;
