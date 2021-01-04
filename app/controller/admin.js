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
    
    async adminGetAllOrders(){
        const { ctx } = this;
        const { Order } = ctx.model;        
        let res,Wrapper;
        const idAdmin = await ctx.service.user.checkIsAdmin(ctx.request.body.userToken);
        if (idAdmin != 'ok') { ctx.status = 400; ctx.body = 'Not admin'; return; }
        const OrderList = await ctx.service.order.getallorderIDs();
        for (const property in OrderList) {
          const CurrentOrder = await Order.findOne({ where: { no: OrderList[property]['no'] } });
          const CurrentClient = await ctx.service.user.getDatabyID(CurrentOrder.user_id);
          const ItemList = await ctx.service.order.getOrderContent(CurrentOrder['no']);
          let ItemInfo;
          for (const property in ItemList){
           ItemInfo = await ctx.service.items.getItemsInfo(ItemList[property]['item_id']);}
          const TempRes = {
            orderId: CurrentOrder.no,
            status: CurrentOrder.transportState,
            customerUserName: CurrentClient.username,
            customerName: CurrentClient.name,
            customerAddress: CurrentClient.address,
            customerPhoneNumber: CurrentClient.telephone,
            createDate: CurrentOrder.createdAt,
            goodsList: ItemList,
          };
          Wrapper = Object.assign({},res, TempRes);
          res = Wrapper;
        }
        ctx.body = res;
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

        // delete user
        const userRes = await ctx.service.user.deleteUser(ctx.request.body.userId);
        if (userRes === 'err') { ctx.body = 'Delete User err'; ctx.status = 400; return; }

        ctx.body = 'ok';
        ctx.status = 200;
    }
}

module.exports = AdminController;
