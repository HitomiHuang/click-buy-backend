const { Product, User, Cart } = require('../models')
const { InputErrorException, NotFoundException } = require('../enums/exceptions')
const { getUser } = require('../utils/auth-helpers')
const cartController = {
  getCart: async (req, res, next) => {
    const userId = getUser(req).id
    const carts = await Cart.findAll(
      {
        where: { userId },
        attributes: { exclude: ['UserId', 'ProductId'] },
        include: { model: Product }
      })
    return res.status(200).json({
      status: 'success',
      data: {
        carts
      }
    })
  }
}
module.exports = cartController