'use strict';

const Controller = require('egg').Controller;

class OrderController extends Controller {
  async echo() {

  }

  async SellerGetOrder() {
    const { ctx } = this;
    const { orderItems, Order, Items } = ctx.model;
    let username, user_id;
    const usertoken = ctx.request.body.userToken;

    // extract data from token
    const userData = await ctx.service.utils.getTokenData(usertoken)
      .catch((err) => { throw new ErrorRes(13001, err, 400); });
    if (userData.error === "ok") { userPayload = userData.data; }
    else { throw new ErrorRes(13001, userData.data, 400); }
    // find id by username
    user_id = await ctx.service.user.getUserID(userPayload.username);
    username = await ctx.service.user.getNameByID(user_id);
    const Orders = await Order.findAll();
    const Ordercount = await Order.count({ where: { seller_id: user_id } });
    const ItemsinOrder = await orderItems.findAll({
      where: { order_no: Orders.orderID }
    });
    const ItemsInfo = await Items.findAll({
      where: { id: ItemsinOrder.item_id }
    });
    var i;
    const res;
    for (i = 0; i < Ordercount; i++) {
      const ItemsWanted = {
        goodId = ItemsinOrder.item_id,
        name = ItemsinOrder.items_name,
        imgURL = ItemsinOrder.items_url,
        price = ItemsInfo.price,
        count = ItemsinOrder.items_quantity
      }
      Object.assign(res, {
        orderID = Ordersfound.orderID,
        status = Ordersfound.status,
        goodsList = ItemsWanted,
      });
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

}

module.exports = OrderController;
