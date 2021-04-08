module.exports = {
  ensureAuthenthicated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    } else {
      return res.status(400).json({
        message: 'Access Restricted.Not Logged In'
      })
    }
  }
}
