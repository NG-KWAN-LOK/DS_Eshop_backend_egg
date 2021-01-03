'use strict';

const Controller = require('egg').Controller;
const jwt = require('jsonwebtoken');
const items = require('../model/items');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
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
            "user_id": findedUserID,
            "sales": 0,
            "category": ctx.request.body.category,
            "delete_hash": ctx.request.body.deleteHash
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
            attributes: ['id', 'name', ['image_url', 'imgURL'], 'price', ["remain_quantity", "stock"], ['is_display', 'isDisplay'], 'sales', 'category', ['delete_hash', 'deleteHash'], 'updated_at'],
            where: {
                user_id: findedUserID,
            },
            order: [
                ['updated_at', 'DESC']
            ],
        })
            .then((res) => {
                ctx.status = 200;
                // console.log('Datares.....:', res, 'length: ', res.length);
                let resData = [];
                for (let i = 0; i < res.length; i++) {
                    // console.log('1', res[i].dataValues.category);    
                    resData.push(res[i].dataValues);
                    // console.log(i, 'is :', res[i].dataValues);
                }
                console.log('finished search');
                ctx.body = resData;
            })
            .catch((err) => { ctx.status = 400; ctx.body = '404 for get userData'; console.log(err); return; });
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
        const findedItems = await ctx.model.Items.findAll({ attributes: ['id', 'image_url', 'is_display', 'name', 'price', 'remain_quantity', 'sales', 'category'], where: { user_id: user_id, is_display: is_display } })
            .then((res) => {
                let resData = [];
                let data = {};
                // console.log('res :', res);
                for (let i = 0; i < res.length; i++) {
                    // console.log('1',res[i].dataValues.category);    
                    data = {
                        'id': res[i].dataValues.id,
                        'imgURL': res[i].dataValues.image_url,
                        'isDisplay': res[i].dataValues.is_display,
                        'name': res[i].dataValues.name,
                        'price': res[i].dataValues.price,
                        'stock': res[i].dataValues.remain_quantity,
                        'sales': res[i].dataValues.sales,
                        'category': res[i].dataValues.category
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
                attributes: ['id', 'name', ['image_url', 'imgURL'], 'description', 'price', 'sales', 'category', ['remain_quantity', 'stock'], ['is_display', 'isDisplay'], ['delete_hash', 'deleteHash']],
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
                    "category": ctx.request.body.category,
                    "remain_quantity": ctx.request.body.stock,
                    "delete_hash": ctx.request.body.deleteHash
                }).then((r) => { ctx.status = 200; ctx.body = 'ok'; return; })
                    .catch((e) => { ctx.status = 400; console.log(e); ctx.body = ('error' + e); return; });
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
    async searchGoodsbyKeyword() {
        const { ctx } = this;
        let _err = false;
        let res;
        const _minPrice = (ctx.request.body.minPrice === "") ? 0 : ctx.request.body.minPrice;
        const _maxPrice = (ctx.request.body.maxPrice === "") ? 9999999 : ctx.request.body.maxPrice;
        const splitKeywords = ctx.request.body.keywords.split(' ');
        const reqData = {
            keywords: splitKeywords,
            orderBy: ctx.request.body.orderBy,	//可轉desc
            orderByKeyword: ctx.request.body.orderByKeyword,//可選name/price/sales
            category: ctx.request.body.category,//sort,可選擇(如是""則忽略)
            minPrice: _minPrice,    //sort價錢範圍(minPrice - maxPrice)如是""則忽略
            maxPrice: _maxPrice   //
        }
        if (ctx.request.body.category === "") { res = await ctx.service.items.searchGoodsbyKeyword(reqData); }
        else { res = await ctx.service.items.searchGoodsWithCategory(reqData); }


        if (res === 'err') { ctx.body = '404 ' + res; console.log(res); ctx.status = 400; return; }
        ctx.status = 200;
        ctx.body = res;

    }
    async getHotsalesGoods() {
        const { ctx } = this;
        let _err = false;
        const res = await ctx.model.Items.findAll({
            attributes: ['id', 'name', 'image_url', 'price', 'remain_quantity', 'sales', 'sales', 'category'],
            order: [['sales', 'desc']],
            limit: 12
        }).then(res => {
            let goodlist = [];
            for (let i = 0; i < res.length; i++) {
                goodlist.push({
                    "id": res[i].dataValues.id,
                    "name": res[i].dataValues.name,
                    "imgURL": res[i].dataValues.image_url,
                    "price": res[i].dataValues.price,
                    "sales": res[i].dataValues.sales,
                    "stock": res[i].dataValues.remain_quantity,
                    "category": res[i].dataValues.category,
                });
            }
            return goodlist;
        })
            .catch(err => { _err = true; console.log(err); return err; });
        if (_err === true) { ctx.body = '404 ' + res; ctx.status = 400; return; }
        ctx.status = 200;
        ctx.body = res;

    }
    
    async SellerpageItemInfo(){
        const {ctx} = this;
        const {Items} = ctx.model;
        const ItemInfo = await Items.findByPk(ctx.request.body.id);
        const res ={
            goodId: ItemInfo.id,
            name: ItemInfo.name,
            price: ItemInfo.price,
            imgURL: ItemInfo.image_url
        }
        ctx.body = res;
        ctx.status = 200;
    }
}

module.exports = ItemsController;
