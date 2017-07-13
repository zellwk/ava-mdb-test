const express = require('express')
const bodyParser = require('body-parser')
const User = require('./models/User')
const app = express()

// ======================================
// # Middlewares
// ======================================
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// ======================================
// # Routes
// ======================================

app.get('/litmus', async (req, res) => {
  const { email } = req.body
  res.json(await User.findOne({email}))
})

app.post('/litmus', async (req, res) => {
  const { email, name } = req.body
  const user = new User({email, name})
  res.json(await user.save())
})

module.exports = app
