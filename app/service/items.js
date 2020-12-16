'use strict';

const Service = require('egg').Service;
const ErrorRes = require('../lib/errorRes');


class ItemsService extends Service {
  async createItems(itemData) {
    const { ctx } = this;
    let result = { "success": false, "Exception": "" };
    await ctx.model.Users.create(newItemData)
      .then(() => { result.success = true; })
      .catch(err => { result.Exception = err; });
    return result;
  }
  async getItemsInfo(item_id) {
    const { ctx } = this;
    let result = [];
    await ctx.model.Items.findByPk(item_id)
      .then((findeddata) => { result.success = true; result.data = findeddata['dataValues']; })
      .catch(err => { result.success = false; result.data = err; });
    return result;
  }
  async minusItemsQuantities(item_id, amount) {
    const { ctx } = this;
    let result;
    await ctx.model.Items.findByPk(item_id)
      .then((findedItem) => {
        result = 'ok';
        findedItem.update({
          remain_quantity: (findedItem['dataValues']['remain_quantity'] - amount),
        });
      })
      .catch(err => { result = err; });
    return result;
  }

}

module.exports = ItemsService;
