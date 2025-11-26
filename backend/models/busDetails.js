module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('busDetails', {
        id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        travelsID : {
            type : DataTypes.INTEGER
        },
        numberPlate : {
            type : DataTypes.STRING,
            unique : true,
            allowNull : false
        },
        AC : {
            type : DataTypes.BOOLEAN,
            allowNull : false
        },
        seatCount : {
            type : DataTypes.INTEGER,
            allowNull : false
        },
        sleeper : {
            type : DataTypes.BOOLEAN,
            allowNull : false
        }
    }, {
        tableName : 'busDetails',
        hooks : true
    });
    Model.associate = function(models){
        this.belongsTo(models.travelsDetails, ({ foreignKey : 'travelsID'}));
    }
    return Model;
}