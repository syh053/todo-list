const express = require('express')
const router = express.Router()

router.get('/register', (req, res, next) => {
  res.send('This is Register Page')
})

router.get('/login', (req, res, next) => {
  res.send('This is Login Page')
})

router.post('/users', (req, res, next) => {
  res.send('This is Users Page')
})

router.post('/login', (req, res, next) => {
  res.send('This is Login Page')
})

router.post('/logout', (req, res, next) => {
  res.send('This is Logout Page')
})

module.exports = router
