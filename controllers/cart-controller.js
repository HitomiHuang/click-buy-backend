const { Product, User, Cart, Shop } = require('../models')
const { InputErrorException, NotFoundException } = require('../enums/exceptions')
const { getUser } = require('../utils/auth-helpers')
const cartController = {
  getCarts: async (req, res, next) => {
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
  },
  addToCart: async (req, res, next) => {
    try {
      const { productId, amount } = req.body
      if (!productId?.trim() || !amount?.trim()) {
        throw new InputErrorException('the fields [productId], [amount] are required')
      }

      const product = await Product.findByPk(productId.trim())
      if (!product) throw new NotFoundException('the product did not exist')
      if (product.amount < amount) throw new InputErrorException('amount is not enough')

      const userId = await getUser(req).id

      await Cart.create({
        userId: userId,
        productId: productId.trim(),
        amount: amount.trim()
      }, {
        fields: ['userId', 'productId', 'amount']
      })

      return res.status(200).json({
        status: 'success',
        data: {
        }
      })
    } catch (err) {
      next(err)
    }
  },
  editCarts: async (req, res, next) => {
    try {
      const { productId, amount } = req.body
      if (!productId?.trim() || !amount?.trim()) {
        throw new InputErrorException('the fields [productId], [amount] are required')
      }

      const product = await Product.findByPk(productId.trim())
      if (!product) throw new NotFoundException('the product did not exist')
      if (product.amount < amount) throw new InputErrorException('amount is not enough')

      const userId = await getUser(req).id

      const cart = await Cart.findOne({ where: { userId, productId: productId.trim() } })
      if (!cart) throw new NotFoundException('the product did not in your cart')

      await cart.update({
        amount: amount.trim()
      })

      return res.status(200).json({
        status: 'success',
        data: {
        }
      })

    } catch (err) {
      next(err)
    }
  }
}
module.exports = cartController