const { Product, User, Cart, Shop } = require('../models')
const { InputErrorException, NotFoundException } = require('../enums/exceptions')
const { getUser } = require('../utils/auth-helpers')
const cartController = {
  getCarts: async (req, res, next) => {
    const userId = getUser(req).id
    const carts = await Cart.findAll(
      {
        where: { userId, status: null },
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
      if (!productId?.trim() || !amount) {
        throw new InputErrorException('the fields [productId], [amount] are required')
      }

      const product = await Product.findByPk(productId.trim())
      if (!product) throw new NotFoundException('the product did not exist')
      if (product.amount < amount) throw new InputErrorException('amount is not enough')

      const userId = await getUser(req).id

      const isCartExist = await Cart.findOne({
        where: {
          userId: userId,
          productId: productId.trim(),
          status: null
        }
      })

      if (isCartExist) {
        await isCartExist.update({
          amount: (isCartExist.amount + amount)
        })
      } else {
        await Cart.create({
          userId: userId,
          productId: productId.trim(),
          amount
        }, {
          fields: ['userId', 'productId', 'amount']
        })
      }

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
        amount
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
  buyProducts: async (req, res, next) => {
    try {
      const { carts } = req.body
      const userId = await getUser(req).id

      if (carts && carts.length) {
        for (let i in carts) {
          let product = carts[i]
          const cart = await Cart.findOne({ where: { userId, productId: product.productId, status: null }, include: { model: Product } })
          if (!cart) throw new NotFoundException('the product did not in your cart')
          if (cart.restAmount < product.amount) throw new InputErrorException('the product is not enough')

          const updateCNT = await cart.update({
            amount: product.amount,
            status: 'check-out'
          })

          const renewProduct = await Product.findByPk(product.productId)
          if (!renewProduct) throw new NotFoundException('the product not found')
          await renewProduct.update({
            restAmount: (renewProduct.restAmount - product.amount),
            soldOut: (renewProduct.soldOut + product.amount)
          })
        }
      }

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