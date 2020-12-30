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
    async Checkout(){
        const {ctx} = this;
        const { ShoppingCart,Order,OrderItems } = ctx.model;
        const usertoken = ctx.request.body.userToken;
        // Extrac userdata 
        const userData = await ctx.service.utils.getTokenData(usertoken)
        const buyer_id = await ctx.model.Users.findOne({ where: { username: userData['data']['username'] } })
          .then(res => { return res['dataValues']['id']; })
          .catch(err => { console.log('err1'); ctx.status = 400; ctx.body = err;return err; });    
        // find all user's item in shoppingCart
        const cartcontent = await ShoppingCart.findAll({
            where: { user_id: buyer_id },
        })
        const thisorder = await Order.create({
            user_id : buyer_id,
        });
        for (const property in cartcontent){
            console.log('create relation for item ', cartcontent[property]['user_id']);
            await OrderItems.create({
                item_id: cartcontent[property]['item_id'],
                order_no: thisorder.id,
                seller_id: cartcontent[property]['seller_id'],
                items_quantity: cartcontent[property]['quantity'],
                items_url: cartcontent[property]['items_url'],
                items_name: cartcontent[property]['items_name']
            });
        }
        ctx.status = 200;
    }
}

module.exports = ShoppingCartController;
