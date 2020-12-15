'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/users/login', controller.session.login);
  router.post('/users/signUp', controller.users.register);
  router.post('/items/new', controller.items.create);
  router.post('/items/getAllItems', controller.items.getAllItems);
  router.post('/items/updateInfo', controller.items.updateInfo);
  router.post('/items/deleteItem', controller.items.deleteItem);
  router.get('/items/getItem', controller.items.searchItem);

  router.get('/sth', controller.home.something);
  router.post('/session/login', controller.session.login);
  router.post('/session/IsloggedIn', controller.session.IsloggedIn);
  router.post('/users/getUserData', controller.users.getData);
  router.post('/session/loginTrigger', controller.session.loginTrigger);

  router.post('/shoppingCart/getAll', controller.shoppingCart.getCartAll);
};
