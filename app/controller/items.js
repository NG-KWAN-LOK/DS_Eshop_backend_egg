'use strict';

const Controller = require('egg').Controller;
const jwt = require('jsonwebtoken');
const items = require('../model/items');

class ItemsController extends Controller {
    async create() {
        const { ctx } = this;
        const { request, response, model } = ctx;
        let userName;
        let userData;
        let findedUserID;
        const userToken = ctx.request.body.userToken;
        jwt.verify(userToken, "my_secret_key", (err, data) => {
            if (err) { console.log('.........faild retrieve token', err); ctx.body = "token error"; return; }
            else {
                userData = Object.assign({}, data['payload']);
                userName = userData['user_name'];
                //console.log('payload', data['payload']);
            }
        });
        if (userName != null) {
            const findedUser = await model.Users.findOne({ where: { username: userName } });
            if (findedUser) {
                //console.log('userId is :', findedUser['dataValues']['id']);
                findedUserID = findedUser['dataValues']['id'];
            }
        }
        else {
            ctx.status = 400;
            ctx.body = "not find the user, contact with backend";
            console.log('usename is ::::', userName);
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
        const _res = await ctx.model.Items.create(itemData)
            .then(() => { ctx.status = 200; ctx.body = "ok"; })
            .catch((err) => { console.log(err); ctx.status = 400; ctx.body = "some error" });
    }
    async getAllItems() {
        const { ctx, app } = this;
        const userToken = ctx.request.body.userToken;
        let userData = {};
        let findedUserID;
        let findedUserName;
        jwt.verify(userToken, "my_secret_key", (err, data) => {
            if (err) { console.log('.........faild retrieve token', err); ctx.status = 400; ctx.body = "usertoken error"; return; }
            else {
                userData = Object.assign({}, data['payload']);
                findedUserName = userData['user_name'];
                //console.log('payload', data['payload']);
            }
        });
        if (findedUserName != null) {
            const findedUser = await ctx.model.Users.findOne({ where: { username: findedUserName } });
            if (findedUser) {
                console.log('userid is ::', findedUser['dataValues']['id']);
                findedUserID = findedUser['dataValues']['id'];
            }
        }
        else {
            ctx.status = 400;
            ctx.body = "not find the user, contact with backend";
            console.log('usename is ::::', findedUserName);
        }
        const res = await ctx.model.Items.findAll({
            attributes: ['id', 'name', ['image_url', 'imgURL'], 'price', ['is_display', 'isDisplay']],
            where: {
                user_id: findedUserID,
            }
        })
            .then((res) => {
                ctx.status = 200;
                console.log('------res1.....', res, 'length: ', res.length);
                let resData = [];
                for (let i = 0; i < res.length; i++) {
                    resData.push(res[i].dataValues);
                    console.log(i, 'is :', res[i].dataValues);
                }
                console.log('finally', resData);
                ctx.body = resData;
            })
            .catch((err) => { ctx.status = 400; ctx.body = '404 for token error'; return; });
    }
}

module.exports = ItemsController;
