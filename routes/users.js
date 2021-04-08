const router = require('express').Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const { ensureAuthenthicated } = require('../config/auth')

const User = require('../models/User')

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/users/success',
    failureRedirect: '/users/failure'
  })(req, res, next)
})

router.get('/success', (req, res) => {
  return res.status(200).json({
    message: 'logged In'
  })
})

router.get('/failure', (req, res) => {
  return res.status(400).json({
    message: 'log in denied'
  })
})

router.get('/dashboard', ensureAuthenthicated, (req, res) => {
  return res.status(400).json({
    message: req.user.name + ' Logged In'
  })
})

router.get('/profile', ensureAuthenthicated, (req, res) => {
  return res.status(400).json({
    name: req.user.name,
    email: req.user.email,
    phoneNo: req.user.phoneNo,
    resumeLink: req.user.resumeLink
  })
})

router.patch('/update',ensureAuthenthicated,(req,res)=>{
  if (!req.body.name || !req.body.resumeLink || !req.body.phoneNo) {
    return res.status(400).json({
      erroMessage: 'missing required parameters. refer documentation'
    })
  }

  User.findOne({email: req.user.email})
    .then((user)=>{
      if(!user)
      {
          return res.status(400).json({
            erroMessage: 'user doesnt exists. please login'
          })
      }
      else
      {
          User.updateOne({ email: req.user.email },
            { $set: { name: req.body.name, resumeLink: req.body.resumeLink, phoneNo: req.body.phoneNo } })
            .then((update) => {
              res.status(200).json({
                message: 'details updated in db'
              })
            })
            .catch((err) => {
              console.log('Error:', err)
            })
      }
    })
    .catch((err) => {
      console.log('Error:', err)
    })

})

router.get('/logout', (req, res) => {
  req.logout()
  return res.status(200).json({
    message: 'logged out'
  })
})

router.post('/register', (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password || !req.body.phoneNo) {
    return res.status(400).json({
      erroMessage: 'missing required parameters. refer documentation'
    })
  }

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        return res.status(400).json({
          erroMessage: 'user already exists. please login'
        })
      } else {
        const name = req.body.name
        const email = req.body.email
        const phoneNo = req.body.phoneNo
        const password = req.body.password
        const resumeLink = req.body.resumeLink

        const newUser = new User({
          name,
          password,
          email,
          phoneNo,
          resumeLink
        })

        // hash
        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            return res.status(400).json({
              erroMessage: err
            })
          }
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
              return res.status(400).json({
                erroMessage: err
              })
            }

            newUser.password = hash
            newUser.save()
              .then((user) => {
                return res.status(200).json({
                  message: 'success'
                })
              })
              .catch((err) => {
                return res.status(400).json({
                  erroMessage: err
                })
              })
          })
        })
      }
    })
    .catch((err) => {
      console.log('Error:', err)
    })
})

module.exports = router
