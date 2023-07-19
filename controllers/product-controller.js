const { Product, Shop } = require('../models')

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
  }
}
module.exports = productController