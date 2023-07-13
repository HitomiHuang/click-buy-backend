'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {   
    }
  }
  Cart.init({
    userId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    status: DataTypes.String
  }, {
    sequelize,
    modelName: 'Cart',
    tableName: 'Carts',
    underscored: true,
  });
  return Cart;
};