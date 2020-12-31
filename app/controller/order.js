'use strict';

const Controller = require('egg').Controller;

class OrderController extends Controller {
  async echo() {

  }

  async SellerGetOrder() {
    const { ctx } = this;
    const { OrderItems, Order, Items } = ctx.model;
    const usertoken = ctx.request.body.userToken;
    let res,ItemID_Current = {};
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
      res = TempRes;
      //res = Object.assign(res, TempRes);
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
    for (const property in OrderList) {
      const CurrentOrder = await Order.findOne({ where: { no: OrderList[property] } });
      const ItemList = await orderItems.findAll({ where: { order_no: OrderList[property] } });
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
        orderId: CurrentOrder.OrderList[property],
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
