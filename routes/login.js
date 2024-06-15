const express = require('express')
const router = express.Router()

const db = require('../db/models')
const User = db.User

const bcrypt = require('bcryptjs')

const passport = require('../config/passport')

router.get('/register', (req, res, next) => {
  return res.render('register')
})

router.get('/login', (req, res, next) => {
  return res.render('login')
})

router.post('/users', (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body

  if (!email) {
    req.flash('error', '未輸入 email')
    return res.redirect('back')
  } else if (!password) {
    req.flash('error', '未輸入密碼')
    return res.redirect('back')
  } else if (password !== confirmPassword) {
    req.flash('error', '第二次密碼輸入與第一次不同')
    return res.redirect('back')
  }

  User.findOne({
    where: { email },
    raw: true
  })

    .then(user => {
      if (user) {
        req.flash('error', '輸入的 email 已註冊')
        return res.redirect('back')
      }

      return bcrypt.hash(password, 10)
        .then(hash => {
          User.create({
            name,
            email,
            password: hash
          })
        })
    })

    .then(create => {
      req.flash('success', '註冊成功')
      res.redirect('login')
    })

    .catch(err => {
      err.errorMessage = '註冊失敗'
      next(err)
    })
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/todos',
  failureRedirect: '/login',
  failureFlash: true
}))

router.post('/logout', (req, res, next) => {
  req.logout(error => {
    if (error) { next(error) }

    return res.redirect('login')
  })
})

router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }))

router.get('/oauth2/redirect/facebook', passport.authenticate('facebook', {
  successRedirect: '/todos',
  failureRedirect: '/login',
  failureFlash: true
}))

module.exports = router
