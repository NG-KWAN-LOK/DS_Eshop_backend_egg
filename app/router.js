'use strict';

// /**
//  * @param {Egg.Application} app - egg application
//  */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/users/login', controller.session.login);
  router.post('/users/signUp', controller.users.register);
  router.post('/users/modifydata', controller.users.ModifyData);
  router.post('/items/new', controller.items.create);
  router.post('/items/getAllItems', controller.items.getAllItems);
  router.post('/items/getItemsbyIsDisplay', controller.items.getItemsbyIsDisplay);
  router.post('/items/updateInfo', controller.items.updateInfo);
  router.post('/items/deleteItem', controller.items.deleteItem);
  router.post('/item/updateDisplayState', controller.items.updateDisplayState);
  router.get('/items/getItem', controller.items.searchItem);
  router.post('/items/searchGoodsbyKeyword', controller.items.searchGoodsbyKeyword);
  router.get('/items/getHotsalesGoods', controller.items.getHotsalesGoods);

  router.post('/comment/create', controller.comment.create);
  router.post('/comment/findAll', controller.comment.findAll);
  router.get('/sth', controller.home.something);
  router.post('/session/login', controller.session.login);
  router.post('/session/IsloggedIn', controller.session.IsloggedIn);
  router.post('/users/getUserData', controller.users.getData);
  router.post('/session/loginTrigger', controller.session.loginTrigger);

  router.post('/shoppingCart/getCartAll', controller.shoppingCart.getCartAll);
  router.post('/shoppingCart/addGoods', controller.shoppingCart.addItemtoCart);
  router.post('/shoppingCart/reduceGoodsAmount', controller.shoppingCart.reduceGoodsAmount);
  router.post('/shoppingCart/deleteCartGood', controller.shoppingCart.deleteCartGood);

  router.post('/sellermenu/getmyorders', controller.order.SellerGetOrder);
  router.post('/sellermenu/setorderstate', controller.order.SellerSetOrderStatus);

  router.post('/buyermenu/getmyorders', controller.order.BuyerGetOrder);

  router.post('/coupon/create', controller.coupon.create);
  router.post('/coupon/modify', controller.coupon.Modify);
  router.get('/coupon/getAll', controller.coupon.getAll);
  router.post('/coupon/getbyname', controller.coupon.getbycontent);

  router.post('/admin/adminGetAllGoods', controller.admin.adminGetAllGoods);
  router.post('/admin/adminGetAllUsers', controller.admin.adminGetAllUsers);
  router.post('/admin/adminDeleteUser', controller.admin.adminDeleteUser);

};
