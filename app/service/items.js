'use strict';

const Service = require('egg').Service;
const ErrorRes = require('../lib/errorRes');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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

  async searchGoodsbyKeyword(requestData) {
    const { ctx } = this;
    let _err = false;
    const res = await ctx.model.Items.findAll({
      attributes: ['id', 'name', 'image_url', 'price', 'remain_quantity', 'sales', 'category'],
      order: [[requestData.orderByKeyword, requestData.orderBy]],
      where: {
        //多個關鍵字keyword 用or尋找實現
        name: { [Op.regexp]: requestData.keywords.join('|') },
        is_display: true,
        price: { [Op.between]: [requestData.minPrice, requestData.maxPrice], },
      }
    }).then(res => {
      let goodlist = [];
      for (let i = 0; i < res.length; i++) {
        goodlist.push({
          "id": res[i].dataValues.id,
          "name": res[i].dataValues.name,
          "imgURL": res[i].dataValues.image_url,
          "price": res[i].dataValues.price,
          "sales": res[i].dataValues.sales,
          "stock": res[i].dataValues.remain_quantity,
          "category": res[i].dataValues.category,
        });
      }
      return goodlist;
    })
      .catch(err => { _err = true; console.log(err); return err; });

    if (_err === true) { return 'err' + res; }
    else { return res; }

  }

  async searchGoodsWithCategory(requestData) {
    const { ctx } = this;
    let _err = false;
    // const keywords = ctx.request.body.keywords.split(' ');
    const res = await ctx.model.Items.findAll({
      attributes: ['id', 'name', 'image_url', 'price', 'remain_quantity', 'sales', 'category'],
      order: [[requestData.orderByKeyword, requestData.orderBy]],
      where: {
        name: { [Op.regexp]: requestData.keywords.join('|') },
        is_display: true,
        price: { [Op.between]: [requestData.minPrice, requestData.maxPrice], },
        category: requestData.category,
      }
    }).then(res => {
      let goodlist = [];
      for (let i = 0; i < res.length; i++) {
        goodlist.push({
          "id": res[i].dataValues.id,
          "name": res[i].dataValues.name,
          "imgURL": res[i].dataValues.image_url,
          "price": res[i].dataValues.price,
          "sales": res[i].dataValues.sales,
          "stock": res[i].dataValues.remain_quantity,
          "category": res[i].dataValues.category,
        });
      }
      return goodlist;
    })
      .catch(err => { _err = true; console.log(err); return err; });

    if (_err === true) { return 'err'; }
    else { return res; }

  }

  async findTBAllGoods() {
    const { ctx } = this;
    const res = await ctx.model.Items.findAll({
      attributes: ['id', 'name', ['image_url', 'imgURL'], 'price', ["remain_quantity", "stock"], ['is_display', 'isDisplay'], 'sales', 'category', 'updated_at'],
      order: [
        ['updated_at', 'DESC']
      ],
      limit: 20,
    }).then(res => {
      let resData = [];
      for (let i = 0; i < res.length; i++) { resData.push(res[i].dataValues); }
      return resData;
    }).catch(err => {
      console.log(err);
      return 'err';
    });
    return res;

  }
}

module.exports = ItemsService;
