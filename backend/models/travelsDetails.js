module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('travelsDetails', {
        id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        ownerID : {
            type : DataTypes.INTEGER,
        },
        isRegister : {
            type : DataTypes.BOOLEAN,
            defaultValue : false
        },
        travelsName : {
            type : DataTypes.STRING,
            defaultValue : null
        },
        CIN : {
            type : DataTypes.STRING,
            unique : true,
            defaultValue : null
        },
        GST : {
            type : DataTypes.STRING,
            unique : true,
            defaultValue : null
        }
    }, {
        fileName : 'travelsDetails',
        hooks : true
    });
    Model.associate = function(models) {
        this.belongsTo(models.users, ({ foreignKey : 'ownerID'}));
        this.hasMany(models.busDetails, ({ foreignKey : 'travelsID'}));
    }
    return Model;
};