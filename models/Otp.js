const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const otpSchema = new Schema({
  otp: {
    type: number,
    required: true,
  },
  expiryTime: {
    type: String,
    required: true,
  }
});

const Otp = mongoose.model("otp", otpSchema);

module.exports = Otp;
