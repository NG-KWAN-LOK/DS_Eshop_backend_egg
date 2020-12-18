'use strict';

const Controller = require('egg').Controller;
const jwt = require('jsonwebtoken');
const items = require('../model/items');

class ItemsController extends Controller {
    async create() {
        const { ctx } = this;
        const { request, response, model } = ctx;
        let findedUsername;
        let userData;
        let findedUserID;
        const userToken = ctx.request.body.userToken;
        jwt.verify(userToken, "my_secret_key", (err, data) => {
            if (err) { console.log('faild retrieve token', err); ctx.body = "404 for retrieve usertoken"; return; }
            else {
                userData = Object.assign({}, data['payload']);
                findedUsername = userData['username'];
                //console.log('payload', data['payload']);
            }
        });
        if (findedUsername != null) {
            await model.Users.findOne({ where: { username: findedUsername } })
                .then(findedUser => {
                    findedUserID = findedUser['dataValues']['id'];
                    console.log('Userid is finded: ', findedUserID);
                    return;
                })
                .catch(err => {
                    console.log(err);
                    ctx.status = 400;
                    ctx.body = '404 for not find user';
                    return;
                });
        }
        else {
            ctx.status = 400;
            ctx.body = "not find the user, contact with backend";
            console.log('usename is ::::', findedUsername);
        }
        const itemData = {
            "name": ctx.request.body.name,
            "description": ctx.request.body.description,
            "image_url": ctx.request.body.imgURL,
            "price": ctx.request.body.price,
            "remain_quantity": ctx.request.body.stock,
            "is_display": ctx.request.body.is_Display,
            "user_id": findedUserID
        };
        //console.log('Userdata is :', itemData);
        await ctx.model.Items.create(itemData)
            .then(() => { ctx.status = 200; ctx.body = "ok"; return; })
            .catch((err) => { console.log(err); ctx.status = 400; ctx.body = "404 error for add Item"; return; });
    }
    async getAllItems() {
        const { ctx, app } = this;
        const userToken = ctx.request.body.userToken;
        let userData = {};
        let findedUserID;
        let findedUsername;
        jwt.verify(userToken, "my_secret_key", (err, data) => {
            if (err) { console.log('.........faild retrieve token', err); ctx.status = 400; ctx.body = "404 for retrieve usertoken"; return; }
            else {
                userData = Object.assign({}, data['payload']);
                findedUsername = userData['username'];
                // console.log('payload', findedUsername);
            }
        });
        if (findedUsername != null) {
            await ctx.model.Users.findOne({ where: { username: findedUsername } })
                .then((findedUser) => {
                    findedUserID = findedUser['dataValues']['id'];
                    console.log('USerid is be searched:', findedUserID);
                    return
                })
                .catch(err => { console.log('err for find user:', err); ctx.status = 400; ctx.body = 'err for find user:' + err; return; });
        }
        else {
            ctx.status = 400;
            ctx.body = "not find the user, contact with backend";
            // console.log('usename is ::::', findedUsername);
        }
        await ctx.model.Items.findAll({
            attributes: ['id', 'name', ['image_url', 'imgURL'], 'price', ["remain_quantity", "stock"], ['is_display', 'isDisplay']],
            where: {
                user_id: findedUserID,
            }
        })
            .then((res) => {
                ctx.status = 200;
                // console.log('Datares.....:', res, 'length: ', res.length);
                let resData = [];
                for (let i = 0; i < res.length; i++) {
                    resData.push(res[i].dataValues);
                    // console.log(i, 'is :', res[i].dataValues);
                }
                console.log('finished search');
                ctx.body = resData;
            })
            .catch((err) => { ctx.status = 400; ctx.body = '404 for get userData'; return; });
    }
    async getItemsbyIsDisplay() {
        const { ctx } = this;
        let _err = false;

        const userPayload = await ctx.service.utils.getTokenData(ctx.request.body.userToken);
        // console.log(userPayload);
        const user_id = await ctx.model.Users.findOne({ where: { username: userPayload['data']['username'] } })
            .then(res => { return res['dataValues']['id']; })
            .catch(err => { console.log('err1'); ctx.status = 400; ctx.body = err; _err = true; return err; });
        if (_err === true) { return; }
        const is_display = (ctx.request.body.isDisplay === 'true') ? true : false;
        // console.log('isDisplay: ', is_display);
        const findedItems = await ctx.model.Items.findAll({ attributes: ['id', 'image_url', 'is_display', 'name', 'price', 'remain_quantity'], where: { user_id: user_id, is_display: is_display } })
            .then((res) => {
                let resData = [];
                let data = {};
                // console.log('res :', res);
                for (let i = 0; i < res.length; i++) {
                    data = {
                        'id': res[i].dataValues.id,
                        'imgURL': res[i].dataValues.image_url,
                        'isDisplay': res[i].dataValues.is_display,
                        'name': res[i].dataValues.name,
                        'price': res[i].dataValues.price,
                        'stock': res[i].dataValues.remain_quantity
                    }
                    resData.push(data);
                    // console.log('is1 :', data);
                }
                // console.log('finished search');
                return resData;
            }).catch((err) => {
                console.log('err2');
                _err = true;
                return err;
            });
        // console.log('is2 :', findedItems);
        if (_err === true) { console.log('err3'); ctx.status = 400; }
        else { ctx.status = 200; }
        ctx.body = findedItems;

    }
    async searchItem() {
        const { ctx } = this;
        const itemID = ctx.request.query.id;
        const res = await ctx.model.Items.findOne(
            {
                attributes: ['id', 'name', ['image_url', 'imgURL'], 'description', 'price', 'sales', 'category', ['remain_quantity', 'stock'], ['is_display', 'isDisplay'],'sale'],
                where: { id: itemID }
            })
            .then((res) => {
                //console.log(res['dataValues']);
                let resData = res['dataValues'];
                ctx.status = 200;
                ctx.body = resData;
            })
            .catch((err) => { ctx.status = 404; ctx.body = '404 for search can\' find item ' });
    }
    async updateInfo() {
        const { ctx } = this;
        const itemID = ctx.request.body.id;
        const res = await ctx.model.Items.findOne(
            { where: { id: itemID } }
        )
            .then((findedItem) => {
                return findedItem.update({
                    "name": ctx.request.body.name,
                    "image_url": ctx.request.body.imgURL,
                    "description": ctx.request.body.description,
                    "price": ctx.request.body.price,
                    "sales": ctx.request.body.sales,
                    "category": ctx.request.body.category,
                    "remain_quantity": ctx.request.body.stock
                }).then((r) => { ctx.status = 200; ctx.body = 'ok'; return; })
                    .catch((e) => { ctx.status = 400; ctx.body = ('error' + e); return; });
            })
            .catch(e => {
                ctx.status = 400;
                ctx.body = 'error' + e;
                return;
            });
    }
    async deleteItem() {
        const { ctx } = this;
        const itemID = ctx.request.body.id;
        await ctx.model.Items.findOne({ where: { id: itemID } })
            .then((findedItem) => {
                findedItem.destroy();
                ctx.status = 200;
                ctx.body = 'ok';
            })
            .catch((e) => { ctx.status = 404; ctx.body = 'error' + e; })
    }
    async updateDisplayState() {
        const { ctx } = this;
        const res = await ctx.model.Items.findByPk(ctx.request.body.goodId)
            .then(findedItem => { findedItem.update({ is_display: ctx.request.body.status }); ctx.status = 200; return 'ok' })
            .catch(err => { ctx.status = 400; return err; });
        console.log(res);
        ctx.body = res;
    }
}

module.exports = ItemsController;
