const mongoose = require('mongoose')

const Schema = mongoose.Schema

const bookSchema = new Schema({
  companyId: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  slotId: {
    type: String,
    required: true
  },
  startTime: {
    type: String,
    required: true
  }
})

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phoneNo: {
    type: String,
    required: true
  },
  resumeLink: {
    type: String,
    default: ''
  },
  approvalStatus: {
    type: Boolean,
    default: true
  },
  booked: [bookSchema]
})

const User = mongoose.model('InternExpoUser', userSchema)

module.exports = User
