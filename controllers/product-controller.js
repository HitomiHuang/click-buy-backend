const { Product, Shop, User } = require('../models')
const { InputErrorException, NotFoundException } = require('../enums/exceptions')
const { getUser } = require('../utils/auth-helpers')
const awsHandler = require('../utils/aws-helpers')
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
      console.log(req.body)
      let { keyword, selectType, orderBy, minPrice, maxPrice } = req.body
      keyword = keyword?.trim() ? keyword.trim() : ''
      selectType = selectType?.trim() ? selectType.trim() : 'updatedAt'
      minPrice = minPrice?.trim() ? minPrice.trim() : 0
      maxPrice = maxPrice?.trim() ? maxPrice.trim() : Number.MAX_VALUE
      orderBy = orderBy === 'ASC' ? 'ASC' : 'DESC'

      const products = await Product.findAll(
        {
          where: {
            name: { [Op.like]: `%${keyword}%` },
            price: {
              [Op.gte]: minPrice,
              [Op.lte]: maxPrice
            },
            status:'enable',
          },
          include: { model: Shop },
          order: [[selectType, orderBy]]
        }
      )

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
  getProductsByShop: async (req, res, next) => {
    try {
      const shop = await Shop.findOne({ where: { userId: getUser(req).id } })
      if (!shop) throw new NotFoundException('the user is not seller')
      const products = await Product.findAll({ where: { shopId: shop.id, status: 'enable' } })

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
      const { name, price, totalAmount, desc } = req.body
      let filePath = ''
      if (!name?.trim() || !price || !totalAmount) {
        throw new InputErrorException('the fields [name], [price], [totalAmount] are required')
      }

      const shop = await Shop.findOne({ where: { userId: getUser(req).id }, include: { model: User } })
      if (!shop) throw new NotFoundException('the user is not seller')

      if (req.file) {
        filePath = await awsHandler.addImg(shop.id, name.trim(), req.file)
      }

      await Product.create({
        name: name.trim(),
        image: filePath,
        price: price,
        restAmount: totalAmount,
        totalAmount: totalAmount,
        soldout: 0,
        desc: desc?.trim(),
        status: 'enable',
        shopId: shop.id
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
      const { id, name, price, totalAmount, desc, status } = req.body
      let filePath = ''

      console.log(req.body.id)

      if (!id) {
        throw new InputErrorException('the fields [id] is required')
      }

      const product = await Product.findByPk(id)
      if (!product) throw new NotFoundException('the product did not exist')

      if (req.file) {
        filePath = await awsHandler.addImg(product.shopId, product.name, req.file)
      }

      await product.update({
        name: name?.trim() || product.name,
        price: price || product.price,
        image: filePath || product.image,
        totalAmount: totalAmount || product.totalAmount,
        restAmount: (product.restAmount + (product.totalAmount - totalAmount)) || product.restAmount,
        desc: desc?.trim() || product.desc,
        status: status || product.status
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