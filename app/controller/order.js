'use strict';

const Controller = require('egg').Controller;

class OrderController extends Controller {
  async echo() {

  }

  async SellerGetOrder() {
    const { ctx } = this;
    const { orderItems,Order,Items,Users } = ctx.model;
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
    const OrderList = await orderItems.aggregate('order_no','DISTINCT',{plain : false},{where : {seller_id : user_id}});
    var i;
    const res={};
    for (const OrderID in OrderList){
      const CurrentOrder = await Order.findOne({where : {no : OrderID}});
      const ItemList = await orderItems.findAll({where : {seller_id : user_id}});
      const ItemsInfo = await Items.findOne({
        where : {id : ItemList.item_id}
      });
      const ItemsWanted = {
        goodId : ItemList.item_id,
        name : ItemList.items_name,
        imgURL : ItemList.items_url,
        price : ItemsInfo.price,
        count : ItemList.items_quantity
      }
      Object.assign(res,{
        orderID : CurrentOrder.orderID,
        status : CurrentOrder.status,
        customerUserName : await ctx.service.user.getNameByID(CurrentOrder.user_id),
        customerName : await ctx.service.user.getUNameByID(CurrentOrder.user_id),
        customerAddress : userData.address,
        customerPhoneNumber : userData.telephone,
        goodsList : ItemsWanted,
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
