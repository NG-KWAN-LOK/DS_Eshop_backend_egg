'use strict';

const Controller = require('egg').Controller;
const ErrorRes = require('../lib/errorRes');

class ShoppingCartController extends Controller {
    async getCartAll() {
        const { ctx } = this;
        const { ShoppingCart } = ctx.model;
        let allSeller = [];
        let userPayload, user_id;
        let _errStatus = true;
        let result = [];
        const usertoken = ctx.request.body.userToken;

        // Get user's token payload 
        const userData = await ctx.service.utils.getTokenData(usertoken)
            .catch((err) => { throw new ErrorRes(13001, err, 400); });
        if (userData.error === "ok") { userPayload = userData.data; }
        else { throw new ErrorRes(13001, userData.data, 400); }

        // use username finded by token get user's ID.
        user_id = await ctx.service.user.getUserID(userPayload.username);

        // find all user's item in shoppingCart
        const res = await ShoppingCart.findAll({
            // attributes: ['seller_id'],
            where: { user_id: user_id },
        }).then(res => {
            //儲存抓出不重複的seller_ID
            for (let i = 0; i < res.length; i++) {
                // console.log('i: ', i, 'res', res[i]);
                let seller_index = allSeller.findIndex(element => element === res[i].dataValues.seller_id);
                let goodInfo = {
                    "goodId": res[i].dataValues.items_id,
                    "imgURL": res[i].dataValues.items_image_url,
                    "name": res[i].dataValues.items_name,
                    "price": res[i].dataValues.items_price,
                    "stock": res[i].dataValues.remain_quantity,
                    "count": res[i].dataValues.quantity,
                };
                if (seller_index != -1) {
                    result[seller_index].goodsList.push(goodInfo);
                }
                else {
                    result.push({
                        "sellerUserName": res[i].dataValues.seller_name,
                        "goodsList": [goodInfo]
                    });
                    allSeller.push(res[i].dataValues.seller_id);
                }
            }
            _errStatus = false;
            return res;
        }).catch(err => { console.log(err); return err; });


        if (_errStatus) { ctx.status = 400; ctx.body = res; }
        else { ctx.status = 200; ctx.body = result; }

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

        // get user's ID by username finded in token .
        const user_id = await ctx.service.user.getUserID(userPayload.username);
        //get goods Information
        const goodInfo = await ctx.service.items.getItemsInfo(ctx.request.body.goodId);
        //add goods to shoppingCart
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
            .then(res => { if (res === 'ok') { ctx.status = 200; ctx.body = res } else { return res; } })
            .catch(err => { ctx.status = 400; ctx.body = err; return err; });
    }

    async deleteCartGood() {
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

        //delete cart good
        const result = await ctx.service.shoppingCart.deleteCartItem(user_id, ctx.request.body.goodId)
            .then(res => { if (res === 'ok') { return 'ok' } else { return res; } })
            .catch(err => { return err; });
        if (result === 'ok') { ctx.body = result; ctx.status = 200; return }
        else { ctx.body = result; ctx.status = 400; }

    }
    async Checkout() {
        const { ctx } = this;
        const { ShoppingCart, Order, OrderItems } = ctx.model;
        const usertoken = ctx.request.body.userToken;
        let resData = [];
        let temp = [];
        // Extrac userdata 
        const userData = await ctx.service.utils.getTokenData(usertoken)
        const buyer_id = await ctx.model.Users.findOne({ where: { username: userData['data']['username'] } })
            .then(res => { return res['dataValues']['id']; })
            .catch(err => { console.log('err1'); ctx.status = 400; ctx.body = err; return err; });

        // find all user's item in shoppingCart
        const cartcontent = await ShoppingCart.findAll({
            where: { user_id: buyer_id },
        })
        const thisorder = await Order.create({
            user_id: buyer_id,
        });

        //檢查購物車Goods 是否有存在 & 有足夠存貨 
        for (const property in cartcontent) {
            console.log('create relation for item ', cartcontent[property]['user_id']);
            // console.log('create relation for item ', cartcontent[property]);

            //檢測商品是否存在(被下架/撤銷)
            const GoodExistres = await ctx.service.items.checkItemExist(cartcontent[property]['items_id']);
            if (GoodExistres === 'no') { console.log('Not Exist ', cartcontent[property]['items_id']); continue; }

            // 檢測商品是否有存貨
            const GoodEnoughres = await ctx.service.items.checkItemEnough(cartcontent[property]['items_id'], cartcontent[property]['quantity']);
            if (GoodEnoughres === 'no') {
                console.log(cartcontent[property]['items_name'], 'Not Enough');
                ctx.body = cartcontent[property]['items_id'] + ' ' + cartcontent[property]['items_name'] + 'Not Enough';
                ctx.status = 400;
                return;
            }
            //紀錄Cart 的所有商品
            resData.push({
                item_id: cartcontent[property]['items_id'],
                order_no: thisorder['dataValues']['no'],
                seller_id: cartcontent[property]['seller_id'],
                items_quantity: cartcontent[property]['quantity'],
                items_url: cartcontent[property]['items_url'],
                items_name: cartcontent[property]['items_name']
            });
        }
        for (let i = 0; i < resData.length; i++) {
            const cartItem = resData[i];

            console.log(cartItem.item_id, cartItem.items_quantity);
            // console.log(cartItem);
            //新增orderItem
            await ctx.model.OrderItems.create(cartItem);

            //減少item的stock
            await ctx.service.items.decreaseStock(cartItem.item_id, cartItem.items_quantity);

            //增加item的sale
            await ctx.service.items.increaseSales(cartItem.item_id, cartItem.items_quantity);

            //刪除購物車的item
            await ctx.service.shoppingCart.deleteCartItem(buyer_id, cartItem.item_id);
        }
        ctx.body = resData;
        ctx.status = 200;
    }
}

module.exports = ShoppingCartController;
