'use strict';

const Service = require('egg').Service;
const ErrorRes = require('../lib/errorRes');

class UserService extends Service {
    async getUserID(userName) {
        const { ctx } = this;
        const result = await ctx.model.Users.findOne({ where: { username: userName } });
        // console.log(result);
        const userID = result['dataValues']['id'];
        return userID;
    }

    async getNameByID(user_id) {
        const { ctx } = this;
        // console.log("seller Id is : ", user_id);
        const result = await ctx.model.Users.findByPk(user_id)
            .catch(err => { throw new ErrorRes(13001, err, 400) });
        // console.log(result);
        const name = result['dataValues']['name'];

        return name;
    }

    async ChangeInfo(userID,NewData) {
        const { ctx } = this;
        let result;
        await ctx.model.Order.findByPk(userID)
            .then((foundOrder) => {
            result = 'ok';
            foundOrder.update({
                name : NewData.customerName,
                telephone : NewData.phoneNumber,
                email : NewData.email,
                address : NewData.address
            });
            })
            .catch(err => { result = err; });
    return result;
    }
}

module.exports = UserService;
