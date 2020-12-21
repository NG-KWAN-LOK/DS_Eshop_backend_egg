'use strict';

const Service = require('egg').Service;

class OrderService extends Service {
    async setOrderStatus(OrderID, newstat) {
        const { ctx } = this;
        let result;
        await ctx.model.Order.findByPk(OrderID)
            .then((foundOrder) => {
            result = 'ok';
            foundOrder.update({
                transportState : newstat,
            });
            })
            .catch(err => { result = err; });
    return result;
    }

}

module.exports = OrderService;
