const express = require('express')
const router = express.Router()

router.get('/register', (req, res, next) => {
  res.render("register")
})

router.get('/login', (req, res, next) => {
  res.render("login")
})

router.post('/users', (req, res, next) => {
  const body = req.body
  res.send(`name : ${body.name} <br> Email : ${body.email} <br> password : ${body.password} <br> confirmPassword : ${body.confirmPassword}`)
})

router.post('/login', (req, res, next) => {
  res.send('This is Login Page')
})

router.post('/logout', (req, res, next) => {
  res.send('This is Logout Page')
})

module.exports = router
