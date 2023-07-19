const { User } = require('../models')
const jwt = require('jsonwebtoken')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const userController = {
  login: (req, res, next) => {
    try{
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '7d' })
      return res.status(200)
        .json({
          status: 'success',
          data: {
            token
          }
        })
    }catch(err){
      next(err)
    }
  }
}

module.exports = userController