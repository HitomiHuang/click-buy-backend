'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shop extends Model {
    static associate(models) {
      Shop.hasMany(models.Product, {foreignKey: 'shopId'})
      Shop.belongsTo(models.User, {foreignKey: 'userId'})
    }
  }
  Shop.init({
    name: DataTypes.STRING,
    logo: DataTypes.STRING,
    addr: DataTypes.STRING,
    desc: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Shop',
    tableName: 'Shops',
    underscored: true
  });
  return Shop;
};