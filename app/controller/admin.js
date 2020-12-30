'use strict';

const Controller = require('egg').Controller;

class AdminController extends Controller {
    async adminGetAllGoods() {

        const { ctx } = this;
        // check for requested user is admin. 
        const idAdmin = await ctx.service.user.checkIsAdmin(ctx.request.body.userToken);
        if (idAdmin != 'ok') { ctx.status = 400; ctx.body = 'Not admin'; return; }

        // pick up all goods in items table
        const res = await ctx.service.items.findTBAllGoods();
        if (res == 'err') { ctx.status = 400; ctx.body = 'Err in get Goods data'; return }
        ctx.status = 200;
        ctx.body = { goodList: res };
    }
    async adminGetAllUsers() {
        const { ctx } = this;

        // check for requested user is admin. 
        const idAdmin = await ctx.service.user.checkIsAdmin(ctx.request.body.userToken);
        if (idAdmin != 'ok') { ctx.status = 400; ctx.body = 'Not admin'; return; }

        // pick up all users in items table
        const res = await ctx.service.user.findTBAllUsers();
        if (res == 'err') { ctx.status = 400; ctx.body = 'Err in get Goods data'; return }
        ctx.status = 200;
        ctx.body = { memberList: res };
    }
    async adminDeleteUser() {
        const { ctx } = this;

        // check for requested user is admin. 
        const idAdmin = await ctx.service.user.checkIsAdmin(ctx.request.body.userToken);
        if (idAdmin != 'ok') { ctx.status = 400; ctx.body = 'Not admin'; return; }

        //delete user-order

        //delete user-cart
        // const cartRes = await ctx.service.shoppingCart.deleteUserCart(ctx.request.body.userId);
        // if (cartRes === 'err') { ctx.body = 'Delete err'; ctx.status = 400; return; }

        //delete user
        // const userRes = await ctx.service.user.deleteUser(ctx.request.body.userId);
        // if (userRes === 'err') { ctx.body = 'Delete User err'; ctx.status = 400; return; }

        ctx.body = 'ok';
        ctx.status = 200;
    }
}

module.exports = AdminController;
