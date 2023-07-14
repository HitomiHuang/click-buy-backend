const express = require('express')
const cors = require('cors')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
app.use(cors())
const passport = require('./config/passport')
const routes = require('./routes')

const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())

app.use('/', routes)

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})
module.exports = app
