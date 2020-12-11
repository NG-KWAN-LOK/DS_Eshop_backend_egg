'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/users/login', controller.session.login);
  router.post('/users/signUp', controller.users.register);
  router.get('/sth', controller.home.something);
  router.post('/session/login', controller.session.login);
  router.post('/session/IsloggedIn',controller.session.IsloggedIn);
  router.post('/users/getData',controller.users.getData);
};
  