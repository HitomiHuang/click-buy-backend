const { Product, Shop } = require('../models')
const { } = require('../enums/exceptions')
const productController = {
  getProducts: async (req, res, next) => {
    try {
      const products = await Product.findAll({ where: { status: 'enable' }, include: { model: Shop } })
      return res.status(200).json({
        status: 'success',
        data: {
          products
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getProduct: async (req, res, next) => {
    try {
      const product = await Product.findByPk(req.params.product_id, { include: { model: Shop } })
      return res.status(200).json({
        status: 'success',
        data: {
          product
        }
      })
    } catch (err) {
      next(err)
    }
  },
  addProduct: async (req, res, next) => {
    try {
      const { name, price, image, amount, desc, status, shopId } = req.body
      if (!name?.trim() || !price?.trim() || !amount?.trim() || !status?.trim() || !shopId.trim()) {
        throw new InputErrorException('the fields [name], [price], [amount], [status], [shopId] are required')
      }

      await Product.create({
        name: name.trim(),
        image: image?.trim(),
        price: price.trim(),
        amount: amount.trim(),
        desc: desc?.trim(),
        status: status.trim(),
        shopId: shopId.trim()
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
module.exports = productController