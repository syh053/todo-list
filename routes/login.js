const express = require('express')
const router = express.Router()

const db = require('../db/models')
const { where } = require('sequelize')
const { raw } = require('mysql2')
const User = db.User

const passport = require('passport')
const LocalStrategy = require('passport-local')

passport.use(new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
  User.findOne({
    where: { email: username },
    raw: true
  })

    .then( user => {
      if (!user || user.password !== password) {
        return done(null, false, {type: 'error', message: 'email 或密碼錯誤!'})
      }
      return done(null, user)
    })
    .catch( err => done(err))
}))

passport.serializeUser( (user, done) => {
  const { id, email, name } = user
  return done(null, { id, email, email })
} )

passport.deserializeUser( (user, done) =>{
  return done(null, { userID: user.id })
} )

router.get('/register', (req, res, next) => {
  return res.render("register")
})

router.get('/login', (req, res, next) => {
  return res.render("login")
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
    where: { email: email },
    raw: true
  })

    .then(user => {

      if (user) {
        req.flash('error', '輸入的 email 已註冊')
        return res.redirect('back')
      }

      return User.create({
        name: name,
        email: email,
        password: password
      })

    })

    .then(create => {
      req.flash('success', '註冊成功')
      res.redirect('login')
    })

    .catch(err => {
      err.errorMessage = "註冊失敗"
      next(err)
    })
})

router.post('/login', passport.authenticate('local', {
  successRedirect:'/todos',
  failureRedirect: '/login',
  failureFlash: true
}))

router.post('/logout', (req, res, next) => {
  req.logout( error => {
    if (error) { next(error) }

    return res.redirect('login')
  } )
})

module.exports = router
