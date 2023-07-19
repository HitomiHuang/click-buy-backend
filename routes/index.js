const express = require('express')
const passport = require('../config/passport')
const router = express.Router()
const userController = require('../controllers/user-controller')
const productController = require('../controllers/product-controller')
const { authenticated, fieldExamine } = require('../middleware/auth')
const localAuthenticate = passport.authenticate('local', { session: false })
const { apiErrorHandler } = require('../middleware/error-handler')

router.post('/login', fieldExamine, localAuthenticate, userController.login)


router.use('/', apiErrorHandler)
module.exports = router
