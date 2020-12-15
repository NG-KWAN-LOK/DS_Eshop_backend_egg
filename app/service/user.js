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
}

module.exports = UserService;
