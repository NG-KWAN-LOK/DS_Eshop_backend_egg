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

    async ChangeInfo(userID, NewData) {
        const { ctx } = this;
        let result;
        await ctx.model.Users.findByPk(userID)
            .then((foundOrder) => {
                result = 'ok';
                foundOrder.update({
                    name: NewData.customerName,
                    telephone: NewData.phoneNumber,
                    email: NewData.email,
                    address: NewData.address
                });
            })
            .catch(err => { result = err; });
        return result;
    }
    async checkIsAdmin(userToken) {
        const { ctx } = this;
        // check for requested user is admin. 
        const userPayload = await ctx.service.utils.getTokenData(userToken);
        if (userPayload.data.username != 'admin') {
            ctx.status = 400;
            console.log('Temp to get admin data :', userPayload.data.username)
            ctx.body = 'Not admin';
            return 'err';
        }
        return 'ok'
    }
    async findTBAllUsers() {
        const { ctx } = this;

        //get users-tb all
        const res = await ctx.model.Users.findAll({
            attributes: ['id', ['username', 'userName'], ['name', 'customerName'], 'address', 'email', ['telephone', 'phoneNumber'], ['created_at', 'createTime']],
            order: [['created_at', 'DESC']],
            limit: 20,
        }).then(res => {
            let resData = [];
            for (let i = 0; i < res.length; i++) { resData.push(res[i].dataValues); }
            return resData;
        })
            .catch(err => { console.log(err); return 'err'; });
        return res;
    }
    async deleteUser(user_id) {
        const { ctx } = this;
        //delete user by his ID
        const res = await ctx.model.Users.findOne({ where: { id: user_id } })
            .then(res => { res.destroy(); return 'ok'; })
            .catch(err => { console.log(err); return 'err' });
        return res;
    }
}

module.exports = UserService;
