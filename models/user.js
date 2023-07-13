'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(model.Shop, {foreignKey})
      User.belongsToMany(models.Product, {
        through: models.Cart,
        foreignKey: 'userId',
        as: 'InCartProduct'
      })
    }
  }
  User.init({
    name: DataTypes.STRING,
    account: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    cellphone: DataTypes.STRING,
    birth: DataTypes.STRING,
    avatar: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true,
  });
  return User;
};