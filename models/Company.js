const mongoose = require('mongoose')

const Schema = mongoose.Schema

const slotSchema = new Schema({
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  bookedBy: {
    type: Array
  },
  available: {
    type: Number,
    default: 5
  },
  total: {
    type: Number,
    default: 5
  }

})

const companySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tags: {
    type: Array,
    default: []
  },
  workFrom:{
    type: String
  },
  slots: [slotSchema]

})

const Company = mongoose.model('InternExpoCompany', companySchema)

module.exports = Company
