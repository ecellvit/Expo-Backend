const router = require('express').Router()
const { ensureAuthenthicated } = require('../config/auth')

const Company = require('../models/Company')

//@Todo Allow only admin
router.post('/add', ensureAuthenthicated, (req,res)=>{
    if (!req.body.name || !req.body.description || !req.body.startTime || !req.body.endTime) {
        return res.status(400).json({
          erroMessage: 'missing required parameters. refer documentation'
        })
      }
    
    Company.findOne({ name: req.body.name })
      .then((company)=>{
        if (company) {
            return res.status(400).json({
              erroMessage: 'company already exists. please update'
            })
        }
        else{
            const name = req.body.name
            const description = req.body.description
            const tags = req.body.tags

            const newCompany = new Company({
                name,
                description,
                tags
              })
            
            const slotData = {
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                bookedBy:[],
                available: req.body.available,
                total: req.body.total
            }

            newCompany.slots = [slotData]

            newCompany.save()
              .then((company) => {
                return res.status(200).json({
                  message: 'success'
                })
              })
              .catch((err) => {
                return res.status(400).json({
                  erroMessage: err
                })
              })

        }
      })
      .catch((err) => {
        console.log('Error:', err)
      })
})

router.post('/addSlot', ensureAuthenthicated, (req,res)=>{
    if (!req.body.name || !req.body.startTime || !req.body.endTime) {
        return res.status(400).json({
          erroMessage: 'missing required parameters. refer documentation'
        })
      }
    
    Company.findOne({ name: req.body.name })
      .then((company)=>{
        if (!company) {
            return res.status(400).json({
              erroMessage: 'company does not exist'
            })
        }
        else{

            const slots = company.slots
            
            const slotData = {
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                bookedBy:[],
                available: req.body.available,
                total: req.body.total
            }

            slots.push(slotData)

            Company.updateOne({ name: req.body.name },
                { $set: { slots: slots} })
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

module.exports = router