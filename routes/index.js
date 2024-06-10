const express = require('express')

const router = express.Router()

const todos = require('./todo')

const login = require('./login')

const authHandler = require('../middlewares/auth-handler')

router.use('/todos', authHandler, todos)

router.use(login)

// setup rounter
router.get('/', (req, res) => {
  res.render('index')
})

module.exports = router
