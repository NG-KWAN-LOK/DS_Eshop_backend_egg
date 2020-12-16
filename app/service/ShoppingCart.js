'use strict';

const Service = require('egg').Service;
const ErrorRes = require('../lib/errorRes');

class ShoppingCartService extends Service {
    async addGoods(consumerID, quantity, goodInfo) {
        const { ctx } = this;
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

    async reduceGoods(consumerID, amount, goodId) {
        const { ctx } = this;

        const res = await ctx.model.ShoppingCart.findOne({
            where: {
                user_id: consumerID,
                items_id: goodId,
            }
        })
            .then(findedItem => {
                let left_quantity = findedItem['dataValues']['quantity'] - amount;
                if (left_quantity > 0) {
                    findedItem.increment('quantity', { by: amount })
                        .then((result) => { return 'ok'; })
                        .catch((err) => { return err; });
                }
                else { return ctx.service.ShoppingCart.deleteCartItem(consumerID, goodId); }
            })
            .catch(err => { return err; })
        return res;
        // .catch(err => { console.log('add goods error', err); return err; });
    }
    async deleteCartItem(consumerID, goodId) {
        const { ctx } = this;
        const result = await ctx.model.ShoppingCart.findOne({
            where: {
                user_id: consumerID,
                items_id: goodId,
            }
        })
            .then(findedItem => {
                findedItem.destroy();
                return 'ok';
            })
            .catch(err => { return err; });
        return result;
    }
}

module.exports = ShoppingCartService;
