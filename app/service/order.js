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
                    transportState: newstat,
                });
            })
            .catch(err => { result = err; });
        return result;
    }
    async deleteUserOrder() {
        const { ctx } = this;
        //delete cart all related-user items
        const res = await ctx.model.Order.findAll({ where: { user_id: user_id } })
            .then(res => { res.destroy(); return 'ok'; })
            .catch(err => { console.log(err); return 'err' });
        return res;
    }
}

module.exports = OrderService;
