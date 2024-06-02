const express = require('express')

const router = express.Router()

const todos = require('./todo')

const login = require('./login')

router.use('/todos', todos)

router.use(login)

// setup rounter
router.get('/', (req, res) => {
  res.render('index')
})

module.exports = router
