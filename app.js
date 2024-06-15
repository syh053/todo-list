// 建立 server
const express = require('express')
const app = express()
const port = 3000

// 載入套件
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const message = require('./middlewares/message-handler')
const error = require('./middlewares/error_handler')
const passport = require('passport')

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}

// 載入路由
const rounter = require('./routes')

console.log('SESSION_SECRET :', process.env.SESSION_SECRET)

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

// 對所有的 request 進行前置處理
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(flash())

app.use(passport.initialize())

app.use(passport.session())

app.use(message)

app.use(rounter)

app.use(error)

// express.listening
app.listen(3000, () => {
  console.log(`express server is running on http://localhost:${port}`)
})
