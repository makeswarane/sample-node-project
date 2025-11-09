const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { to, TE, ReE } = require('../responseHandler');
const { ERROR } = require('../constants/messages');
const cryptoService = require('../services/crypto.service');
module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('users', {
        id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        name : {
            type : DataTypes.STRING,
            allowNull : false
        },
        email : {
            type : DataTypes.STRING,
            unique : true,
            allowNull : false
        },
        password : {
            type : DataTypes.STRING,
            allowNull : false
        },
        phoneNumber : {
            type : DataTypes.STRING(10),
            allowNull : false
        },
        address : {
            type : DataTypes.TEXT,
            defaultValue : null
        },
        role : {
            type : DataTypes.STRING,
            defaultValue : 'customer',
        },
        forgetPass : {
            type : DataTypes.STRING,
            defaultValue : null
        },
        forgetpassAt : {
            type : DataTypes.DATE,
            defaultValue : null
        },
        createdAt : {
            type : DataTypes.DATE,
            defaultValue : DataTypes.NOW
        }
    }, {
        tableName : 'users',
        hooks : true
    });
    Model.associate = function(models) {
        this.hasOne(models.travelsDetails, ({ foreignKey : 'ownerID'}));
    };
    Model.beforeSave(async (user) => {
        if(user.changed('password')){
            let err, salt, hash, rounds;
            rounds = crypto.randomInt(4, 10);
            if(!rounds) console.log('unnable to round ');
            salt = await bcrypt.genSalt(rounds);
            if(!salt) console.log('unnable to salt ');
            [err, hash] = await to(bcrypt.hash(user.password, salt));
            if(err) console.log('unnable to hash ', err);
            user.password = hash;
        }
    });
    Model.prototype.comparePassword = async function(pw) {
        let err, cmp;
        [err, cmp] = await to(bcrypt.compare(pw, this.password));
        if(err) TE(err);
        if(!cmp) TE(ERROR.INAVLID_PASSWORD);
        return this;
    };
    Model.prototype.forgetComparePassword = async function(pw) {
        let err, cmp;
        [err, cmp] = await to(bcrypt.compare(pw, this.password));
        if(err) TE(err);
        if(cmp) TE(ERROR.NEW_PASSWORD);
        return this;
    };
    Model.prototype.getToken = async function(user){
        const token = 'Bearer '+jwt.sign({
            id : user.dataValues.id,
            name : user.dataValues.name,
            email : user.dataValues.email,
            role : user.dataValues.role
        }, CONFIG.jwt_encryption, { expiresIn : CONFIG.jwt_expiresIn});
        [err, encryptedToken] = await to(cryptoService.encrypt(token));
        if(err) TE(err);
        return encryptedToken;
    }
    return Model;
};