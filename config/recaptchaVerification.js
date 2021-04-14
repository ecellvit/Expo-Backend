const request = require('request')

const recaptchaVerification = (req, res, next) => {
  if (!req.body.captcha) {
    return res.status(400).json({
      message: 'captcha missing'
    })
  }

  const verifyUrl =
    'https://www.google.com/recaptcha/api/siteverify?secret=' +
    process.env.SECRET_KEY +
    '&response=' +
    req.body.captcha
  request(verifyUrl, (err, response, body) => {
    body = JSON.parse(body)
    console.log(err)
    console.log(body)
    try {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.toString()
        })
      }
      if (!body.success || body.score < 0.4) {
        return res.status(400).json({
          success: false,
          message: 'captcha failed'
        })
      }
      next()
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err
      })
    }
  })
}

module.exports = recaptchaVerification
