const { Product, Shop } = require('../models')
const { InputErrorException, NotFoundException } = require('../enums/exceptions')
const { Op } = require("sequelize")
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
  searchProducts: async (req, res, next) => {
    try {
      let { keyword, type, orderBy, minPrice, maxPrice } = req.body
      keyword = keyword?.trim() ? keyword.trim() : ''
      type = type?.trim() ? type.trim() : 'updatedAt'
      minPrice = minPrice?.trim() ? minPrice.trim() : 0
      maxPrice = maxPrice?.trim() ? maxPrice.trim() : Number.MAX_VALUE
      orderBy = 'DESC' ? 'DESC' : 'ASC'

      const products = await Product.findAll({
        where: {
          name: { [Op.like]: `%${keyword}%` },
          price: {
            [Op.gte]: minPrice,
            [Op.lte]: maxPrice
          }
        },
        include: { model: Shop },
        order: [[type, orderBy]]
      })

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
  },
  editProduct: async (req, res, next) => {
    try {
      const { id, name, price, image, amount, desc, status, shopId } = req.body
      if (!id?.trim() || !name?.trim() || !price?.trim() || !amount?.trim() || !status?.trim() || !shopId.trim()) {
        throw new InputErrorException('the fields [id], [name], [price], [amount], [status], [shopId] are required')
      }

      const product = await Product.findByPk(id)
      if (!product) throw new NotFoundException('the product did not exist')

      await product.update({
        name: name.trim() || product.name,
        price: price.trim() || product.price,
        image: image?.trim() || product.image,
        amount: amount.trim() || product.amount,
        desc: desc?.trim() || product.desc,
        status: status.trim() || product.status
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