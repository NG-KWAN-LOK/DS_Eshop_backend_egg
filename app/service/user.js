'use strict';

const Service = require('egg').Service;

class UserService extends Service {
    async getUserID(userName) {
        const { ctx } = this;
        const userID = ctx.model.Users.findOne({ where: { name: userName }, attributes: ['id'] });
        return userID;
    }
}

module.exports = UserService;
