const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const { NotFoundException, AccountOrPasswordWrongException } = require('../enums/exceptions')
const { User } = require('../models')
const JWTSECRET = process.env.JWT_SECRET

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password'
  },
  async (account, password, done) => {
    try {
      const user = await User.findOne({ where: { account } })
      if (!user) throw new NotFoundException('the account have not been registered')
      if (user.password !== password) throw new AccountOrPasswordWrongException('account or password wrong')
      return done(null, user)
    } catch (err) {
      return done(err, false)
    }
  }
))

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWTSECRET
}

passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  User.findByPk(jwtPayload.id)
    .then(user => cb(null, user))
    .catch(err => cb(err))
}))

module.exports = passport
