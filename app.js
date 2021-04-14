require('dotenv').config()
const express = require('express')
const users = require('./routes/users')
const company = require('./routes/company')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const cors = require('cors')

const app = express()

// passport config
require('./config/passport')(passport)

const PORT = process.env.PORT

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Express Session
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
  })
)

// Passport
app.use(passport.initialize())
app.use(passport.session())

// Connect to Mongo
mongoose
  .connect(process.env.MONGODB_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('MongoDb Connected ......')
  })
  .catch((err) => {
    console.log('Error:', err)
  })

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, auth-token'
  )
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    return res.status(200).json({})
  }
  next()
})

app.use(cors())

app.get('/', (req, res) => {
  res.status(200).json({
    document: 'expo',
    message: 'refer docs'
  })
})

app.use('/users', users)
app.use('/company', company)

app.listen(PORT, () => {
  console.log('Server Started on port', PORT)
})
