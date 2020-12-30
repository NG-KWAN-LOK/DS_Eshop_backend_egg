'use strict';

const Controller = require('egg').Controller;

class OrderController extends Controller {
  async echo() {

  }

  async SellerGetOrder() {
    const { ctx } = this;
    const { OrderItems, Order, Items } = ctx.model;
    const usertoken = ctx.request.body.userToken;

    // extract data from token
    const userData = await ctx.service.utils.getTokenData(usertoken)
      .catch((err) => { throw new ErrorRes(13001, err, 400); });
    const user_id = await ctx.model.Users.findOne({ where: { username: userData['data']['username'] } })
      .catch(err => { console.log('err1'); ctx.status = 400; ctx.body = err; _err = true; return err; });
    // find id by username
    const OrderList = await OrderItems.aggregate('order_no','DISTINCT',{plain : false},{where : {seller_id : user_id}});
    let res={};
    for (var OrderID in OrderList){
      const CurrentOrder = await Order.findOne({where : {no : OrderID}});
      const ItemList = await orderItems.findAll({where : {seller_id : user_id}});
      const ItemsInfo = await Items.findOne({
        where: { id: ItemList.item_id }
      });
      const ItemsWanted = {
        goodId: ItemList.item_id,
        name: ItemList.items_name,
        imgURL: ItemList.items_url,
        price: ItemsInfo.price,
        count: ItemList.items_quantity
      }
      Object.assign(res, {
        orderID: CurrentOrder.orderID,
        status: CurrentOrder.status,
        customerUserName: await ctx.service.user.getNameByID(CurrentOrder.user_id),
        customerName: await ctx.service.user.getUNameByID(CurrentOrder.user_id),
        customerAddress: userData.address,
        customerPhoneNumber: userData.telephone,
        createDate: CurrentOrder.created_at,
        goodsList: ItemsWanted,
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

  async BuyerGetOrder() {
    const { ctx } = this;
    const { OrderItems, Order, Items } = ctx.model;
    const usertoken = ctx.request.body.userToken;
    let userPayload;

    // extract data from token
    const userData = await ctx.service.utils.getTokenData(usertoken)
      .catch((err) => { throw new ErrorRes(13001, err, 400); });
    const userid = await ctx.model.Users.findOne({ where: { username: userData['data']['username'] } })
      .catch(err => { console.log('err1'); ctx.status = 400; ctx.body = err; _err = true; return err; });
    if (userData.error === "ok") { userPayload = userData.data; }
    else { throw new ErrorRes(13001, userData.data, 400); }
    const OrderList = await OrderItems.aggregate('order_no', 'DISTINCT', { plain: false }, { where: { user_id: userid } });
    let res = {};
    for (const OrderID in OrderList) {
      const CurrentOrder = await Order.findOne({ where: { no: OrderID } });
      const ItemList = await orderItems.findAll({ where: { order_no: OrderID } });
      const ItemsInfo = await Items.findOne({
        where: { id: ItemList.item_id }
      });
      const ItemsWanted = {
        goodId: ItemList.item_id,
        name: ItemList.items_name,
        imgURL: ItemList.items_url,
        price: ItemsInfo.price,
        count: ItemList.items_quantity
      }
      Object.assign(res, {
        orderID: CurrentOrder.orderID,
        status: CurrentOrder.status,
        customerUserName: await ctx.service.user.getNameByID(CurrentOrder.userid),
        customerName: await ctx.service.user.getUNameByID(CurrentOrder.userid),
        customerAddress: userData.address,
        customerPhoneNumber: userData.telephone,
        createDate: CurrentOrder.created_at,
        goodsList: ItemsWanted,
      });
    }
    ctx.body = res;
  }
}

module.exports = OrderController;
