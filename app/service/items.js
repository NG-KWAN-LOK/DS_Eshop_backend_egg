'use strict';

const Service = require('egg').Service;


class ItemsService extends Service {
  async createItems(itemData) {
    const { ctx } = this;
    let result = { "success": false, "Exception": "" };
    await ctx.model.Users.create(newItemData)
      .then(() => { result.success = true; })
      .catch(err => { result.Exception = err; });
    return result;
    // response.body = _res;
  }
}

module.exports = ItemsService;
