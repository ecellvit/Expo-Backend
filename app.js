require('dotenv').config()
const express = require('express')
const users = require('./routes/users')
const company = require('./routes/company')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')

const app = express()

// passport config
require('./config/passport')(passport)

const PORT = process.env.PORT

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Express Session
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true
}))

// Passport
app.use(passport.initialize())
app.use(passport.session())

// Connect to Mongo
mongoose.connect(process.env.MONGODB_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDb Connected ......')
  })
  .catch((err) => {
    console.log('Error:', err)
  })

app.use('/users', users)
app.use('/company', company)

app.get('/', (req, res) => {
  res.status(200).json({
    document: 'expo',
    message: 'refer docs'
  })
})

app.listen(PORT, () => {
  console.log('Server Started on port', PORT)
})
