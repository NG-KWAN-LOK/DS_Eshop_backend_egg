'use strict';

const Service = require('egg').Service;


class ItemsService extends Service {
  async createItems(itemData, token) {
    const { ctx } = this;
    let result = { "success": false, "Exception": "" };
    const userData = await ctx.service.utils.getTokenData(token);
    console.log('result::.................', userData);
    if (userData['error'] === false) { console.log('...........get success', userData); const user_name = userdata.user_name; }
    else { console.log('...........user', userData); return result.success = false };

    const newItemData = Object.assign({}, itemData, { user_name });
    console.log('............data', newItemData);
    await ctx.model.Users.create(newItemData)
      .then(() => { result.success = true; })
      .catch(err => { result.Exception = err; });
    return result;
    // response.body = _res;
  }
}

module.exports = ItemsService;
