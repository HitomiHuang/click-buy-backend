const { User, Shop } = require('../models')
const jwt = require('jsonwebtoken')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const userController = {
  login: async (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      if (userData.role === 'seller') {
        const shop = await Shop.findOne({ where: { userId: userData.id } })
        userData.shopId = shop.id || ''
      }
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '7d' })
      return res.status(200)
        .json({
          status: 'success',
          data: {
            token,
            user: userData
          }
        })
    } catch (err) {
      next(err)
    }
  },
  getCurrentUser: async(req, res, next) => {
    try{
      const userData = req.user.toJSON()
      if (userData.role === 'seller') {
        const shop = await Shop.findOne({ where: { userId: userData.id } })
        userData.shopId = shop.id || -1
      }
      return res.status(200)
        .json({
          status: 'success',
          data: {
            id: userData.id,
            name: userData.name,
            avatar: userData.avatar,
            role: userData.role,
            shopId: userData.shopId
          }
        })
    }catch(err){
      next(err)
    }
  },
  getUserId: async (req, res, next) => {
    try {
      const { userId } = req.params
      const user = await User.findByPk(userId)
      delete user.password
      return res.status(200)
        .json({
          status: 'success',
          data: {
            user
          }
        })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController