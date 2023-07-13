'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Shop, {foreignKey: 'shopId'})
      Product.belongsToMany(models.User, {
        through: models.cart,
        foreignKey: 'productId',
        as: 'ProductBuyer'
      })
    }
  }
  Product.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    price: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    desc: DataTypes.STRING,
    status: DataTypes.STRING,
    shopId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'Products',
    underscored: true,
  });
  return Product;
};