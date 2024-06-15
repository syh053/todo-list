const passport = require('passport')

const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook')

const db = require('../db/models')
const User = db.User

const bcrypt = require('bcryptjs')


passport.use( new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
  User.findOne({
    where: { email: username }
  })

    .then(user => {
      if (!user) {
        return done(null, false, { type: 'error', message: 'email 或密碼錯誤!' })
      }

      // 此處將檢查密碼是否經過雜湊處理，若沒有則將密碼進行雜湊後驗證
      if (!user.password.startsWith('$2a$')) {
        return bcrypt.hash(user.password, 10)

          .then(hash => user.update({ password: hash }))
          .then(() => {
            return bcrypt.compare(password, user.password)
              .then(result => {
                if (!result) {
                  return done(null, false, { type: 'error', message: 'email 或密碼錯誤!' })
                } else {
                  return done(null, user)
                }
              })
          })
      }

      return bcrypt.compare(password, user.password)
        .then(result => {
          if (!result) {
            return done(null, false, { type: 'error', message: 'email 或密碼錯誤!' })
          } else {
            return done(null, user)
          }
        })
    })
    .catch(err => {
      err.errorMessage = '登入失敗'
      done(err)
    })
}))

passport.use( new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ['displayName', 'email']
}, (accessToken, refreshToken, profile, cb) => {
  const name = profile.displayName
  const email = profile.emails[0].value

  User.findOne({
    where: { email }
  })
    .then(user => {
      if (!user) {
        const keyword = Math.random().toString(36).slice(10)
        return bcrypt.hash(keyword, 10)
          .then(hash => User.create({ name, email, password: hash })
            .then(user => cb(null, user))
          )
      }

      cb(null, user)
    })

    .catch(err => {
      err.errorMessage = '登入失敗'
      cb(err)
    })
}))

passport.serializeUser((user, done) => {
    const { id, email, name } = user
    return done(null, { id, email })
})

passport.deserializeUser((user, done) => {
    return done(null, { userID: user.id })
})

module.exports = passport
