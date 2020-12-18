'use strict';

const Service = require('egg').Service;
const ErrorRes = require('../lib/errorRes');

class ShoppingCartService extends Service {
    async addGoods(consumerID, amount, goodInfo) {
        const { ctx } = this;
        // console.log("goodeInfo is : ", goodInfo);
        const seller_name = await ctx.service.user.getNameByID(goodInfo.user_id);
        // console.log('info is : ', goodInfo);
        console.log('quantity is : ', amount);
        const findedItem = await ctx.model.ShoppingCart.findOne({
            where: {
                "user_id": consumerID,
                "items_id": goodInfo.id
            }
        });
        console.log('data is : ', findedItem);
        if (findedItem) { await findedItem.increment('quantity', { by: amount }); }
        else {
            const res = await ctx.model.ShoppingCart.create({
                "quantity": amount,
                "remain_quantity": goodInfo.amount,
                "user_id": consumerID,
                "seller_id": goodInfo.user_id,
                "seller_name": seller_name,
                "items_id": goodInfo.id,
                "itemsSub_Id": goodInfo.sub_id,
                "items_name": goodInfo.name,
                "items_price": goodInfo.price,
                "items_image_url": goodInfo.image_url
            })
                .catch(err => { console.log('add goods error', err); return err; });
            // console.log(res);
        }
        return 'ok';
    }

    async deleteCartItem(consumerID, goodId) {
        const { ctx } = this;
        console.log('enter1');
        const result = await ctx.model.ShoppingCart.findOne({
            where: {
                user_id: consumerID,
                items_id: goodId,
            }
        })
            .then(findedItem => {
                console.log(findedItem);
                findedItem.destroy();
            })
            .catch(err => { console.log(err); return err; });
        console.log('delete : ', result);
        return result;
    }

    async reduceGoods(consumerID, amount, goodId) {
        const { ctx } = this;
        let res;
        const findedItem = await ctx.model.ShoppingCart.findOne({
            where: {
                user_id: consumerID,
                items_id: goodId,
            }
        }).catch(err => { return err; })
        if (findedItem === null) { return 'not find cart item' };
        let left_quantity = findedItem['dataValues']['quantity'] - amount;
        console.log('remain', findedItem['dataValues']['quantity'], 'amount', amount, 'left_quantity ', left_quantity);

        if (left_quantity > 0) {
            res = await findedItem.decrement('quantity', { by: amount })
                .then((result) => { return 'ok'; })
                .catch((err) => { return err; });
            return res;
        }
        else {
            console.log('tt');
            const result = await ctx.model.ShoppingCart.findOne({ where: { user_id: consumerID, items_id: goodId, } })
                .then(findedItem => { findedItem.destroy(); return 'ok' })
                .catch(err => { return err; })
            return result;
        }
        
    }

}

module.exports = ShoppingCartService;
