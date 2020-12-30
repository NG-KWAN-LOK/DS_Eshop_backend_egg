'use strict';

const Controller = require('egg').Controller;

class AdminController extends Controller {
    async adminGetAllGoods() {

        const { ctx } = this;
        // check for requested user is admin. 
        const userPayload = await ctx.service.utils.getTokenData(ctx.request.body.userToken);
        if (userPayload.data.username != 'admin') {
            ctx.status = 400;
            console.log('Temp to get admin data :', userPayload.data.username)
            ctx.body = 'Not admin';
            return;
        }
        // pick up all goods in items table
        const res = await ctx.service.items.findTBAllGoods();
        if (res == 'err') { ctx.status = 400; ctx.body = 'Err in get Goods data'; return }
        ctx.status = 200;
        ctx.body = { goodList: res };
    }
}

module.exports = AdminController;
