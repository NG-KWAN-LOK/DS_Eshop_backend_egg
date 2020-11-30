'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'uwu';
  }
  async something(){
    const { ctx }  = this;
    ctx.body = 'AAAAAAAAAAAAA';
  }
}

module.exports = HomeController;
