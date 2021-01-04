'use strict';

const Controller = require('egg').Controller;

class OrderController extends Controller {
  async echo() {

  }

  async SellerGetOrder() {
    const { ctx } = this;
    const { OrderItems, Order, Items } = ctx.model;
    const usertoken = ctx.request.body.userToken;
    let res,Wrapper = {};
    // extract data from token
    const userData = await ctx.service.utils.getTokenData(usertoken)
    const user_id = await ctx.model.Users.findOne({ where: { username: userData['data']['username'] } })
      .then(res => { return res['dataValues']['id']; })
    // find id by username
    const OrderList = await ctx.service.order.getUserOrderIDs(user_id);
    for (const property in OrderList) {
      const CurrentOrder = await Order.findOne({ where: { no: OrderList[property]['DISTINCT'] } });
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

  async SellerSetOrderStatus() {
    const { ctx } = this;
    const usertoken = ctx.request.body.userToken;
    const ID = ctx.request.body.orderId;
    const newstat = ctx.request.body.status;
    let userPayload;
    console.log('Enter');
    // Extract token data 
    const userData = await ctx.service.utils.getTokenData(usertoken)
      .catch((err) => { ctx.status = 400; ctx.body = err; });
    if (userData.error === "ok") { userPayload = userData.data; }
    else { ctx.status = 400; ctx.body = err; return; }
    const result = await ctx.service.order.setOrderStatus(ID, newstat)
      .then(res => { if (res === 'ok') { ctx.status = 200 } else { ctx.status = 400 } })
      .catch(err => { ctx.status = 400; });
  }

  async BuyerGetOrder() {
    const { ctx } = this;
    const { OrderItems, Order, Items } = ctx.model;
    const usertoken = ctx.request.body.userToken;
    let userPayload,res,Wrapper;

    // extract data from token
    const userData = await ctx.service.utils.getTokenData(usertoken)
      .catch((err) => { throw new ErrorRes(13001, err, 400); });
    const user_id = await ctx.model.Users.findOne({ where: { username: userData['data']['username'] } })
      .catch(err => { console.log('err1'); ctx.status = 400; ctx.body = err; _err = true; return err; });
    if (userData.error === "ok") { userPayload = userData.data; }
    else { throw new ErrorRes(13001, userData.data, 400); }
    const OrderList = await ctx.service.order.getUserBuyOrderIDs(user_id);
    for (const property in OrderList) {
      const CurrentOrder = await Order.findOne({ where: { no: OrderList[property]['DISTINCT'] } });
      const ItemList = await OrderItems.findAll({attributes:['item_id','seller_id','items_quantity'],where: { order_no: CurrentOrder['no'] } });
      const Formatter = {
        orderId: CurrentOrder.no,
        status: CurrentOrder.transportState,
        createDate: CurrentOrder.createdAt,
        goodsList: ItemList,
      };
      Wrapper = Object.assign({},res,Formatter);
      res = Wrapper;
    }
    ctx.body = res;
  }
}

module.exports = OrderController;
