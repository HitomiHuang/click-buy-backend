const passport = require('../config/passport')
const { InputErrorException, AuthErrorException } = require('../enums/exceptions')
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (!user || err) {
      throw new AuthErrorException('unauthorized user')
    }
    req.user = user
    return next()
  })(req, res, next)
}

const fieldExamine = (req, res, next) => {
  const account = req.body.account?.trim()
  const password = req.body.password?.trim()

  if (!account || !password) {
    throw new InputErrorException('the field [account] or [password] is required')
  }
  return next()
}

module.exports = {
  authenticated,
  fieldExamine
}