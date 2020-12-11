'use strict';

const Controller = require('egg').Controller;
const jwt = require('jsonwebtoken')

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
}

module.exports = ItemsController;
