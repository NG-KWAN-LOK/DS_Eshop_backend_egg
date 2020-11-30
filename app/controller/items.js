'use strict';

const Controller = require('egg').Controller;

class ItemsController extends Controller {
    async Create() {
        const { ctx, model } = this;
        const res = await Items.create({ name: "蘋果", price: 5000 });
    }
}

module.exports = ItemsController;
