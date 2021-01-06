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

    // SELECT`id`, `name`, `image_url`, `price`, `remain_quantity`, `sales`, `category`
    // FROM`items` AS`items` WHERE`items`.`name` REGEXP name AND`items`.`is_display` = is_display AND`items`.`price`
    // BETWEEN requestData.minPrice AND requestData.maxPrice 
    // ORDER BY`items`.requestData.orderByKeyword requestData.orderBy;
    
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
      //limit: 20,
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
  async checkItemExist(item_id) {
    const { ctx } = this;
    const res = ctx.model.Items.findOne({ where: { id: item_id } })
      .then(res => { return 'yes'; })
      .catch(err => 'no');
    return res;
  }
  async checkItemEnough(item_id, cart_quantity) {
    const { ctx } = this;
    const itemInfo = await ctx.service.items.getItemsInfo(item_id);

    if (cart_quantity <= itemInfo.data.remain_quantity) { return 'yes'; }
    else { return 'no'; }
  }

  async decreaseStock(item_id, cart_quantity) {
    const { ctx } = this;
    await ctx.model.Items.decrement(['remain_quantity'], { by: cart_quantity, where: { id: item_id } });
    return;
  }
  async increaseSales(item_id, cart_quantity) {
    const { ctx } = this;
    await ctx.model.Items.increment(['sales'], { by: cart_quantity, where: { id: item_id } });
    return;
  }
  async getSellerID(item_id){
    const {ctx} = this;
    const Item = await ctx.model.Items.findOne({where:{id:item_id}});
    const SellerID = Item.user_id;
    return SellerID;
  }
}

module.exports = ItemsService;
