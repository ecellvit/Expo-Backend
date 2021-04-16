const mongoose = require('mongoose')

const Schema = mongoose.Schema

const spamSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  blocked:{
      type: Boolean,
      default:false
  },
  count:{
    type: Number,
    required: true
  },
  expiryTime: {
    type: String
  }
})

const Spam = mongoose.model('spam', spamSchema)

module.exports = Spam
