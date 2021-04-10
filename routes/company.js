const router = require('express').Router()
const { ensureAuthenthicated } = require('../config/auth')

const Company = require('../models/Company')

router.post('/add', ensureAuthenthicated, (req,res)=>{
  if(req.user._id.equals(process.env.ADMIN))
  {
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
  }
  else
  {
    return res.status(400).json({
      erroMessage: 'unauthorized access request'
    })
  }

})

router.get('/getAll',ensureAuthenthicated,(req,res)=>{
    Company.find()
        .then((infos)=>{
            res.status(200).json(infos)
        })
})

router.post('/getData',ensureAuthenthicated,(req,res)=>{
    if (!req.body.name) {
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
            else
            {
                return res.status(200).json(company)
            }
        })
        .catch((err) => {
            console.log('Error:', err)
        })
})

router.post('/addSlot', ensureAuthenthicated, (req,res)=>{
  if(req.user._id.equals(process.env.ADMIN))
  {
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
  }
  else
  {
    return res.status(400).json({
      erroMessage: 'unauthorized access request'
    })
  }
    
})

router.patch('/updateSlot', ensureAuthenthicated, (req,res)=>{
  if(req.user._id.equals(process.env.ADMIN))
  {
    if (!req.body.name || !req.body.id || !req.body.startTime || !req.body.endTime ) {
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
            
            for (let i = 0; i < slots.length; i++) {
                if (slots[i]._id.equals(req.body.id)) {
                    slots[i].startTime = req.body.startTime
                    slots[i].endTime = req.body.endTime
                    if(req.body.available)
                    {
                        slots[i].available = req.body.available
                    }
                    if(req.body.total)
                    {
                        slots[i].total = req.body.total
                    }
                }
            }

            Company.updateOne({ name: req.body.name },
                { $set: { slots: slots} })
                .then((update) => {
                  res.status(200).json({
                    message: 'slot updated, details updated in db'
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
    }
    else
    {
      return res.status(400).json({
        erroMessage: 'unauthorized access request'
      })
    }
})

router.delete('/deleteSlot', ensureAuthenthicated, (req,res)=>{
  if(req.user._id.equals(process.env.ADMIN))
  {
    if (!req.body.name || !req.body.id ) {
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
            
            for (let i = 0; i < slots.length; i++) {
                if (slots[i]._id.equals(req.body.id)) {
                    slots.splice(i, 1)
                }
            }

            Company.updateOne({ name: req.body.name },
                { $set: { slots: slots} })
                .then((update) => {
                  res.status(200).json({
                    message: 'slot deleted, details updated in db'
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
    }
    else
    {
      return res.status(400).json({
        erroMessage: 'unauthorized access request'
      })
    }
})


router.delete('/deleteCompany', ensureAuthenthicated, (req,res)=>{
  if(req.user._id.equals(process.env.ADMIN))
  {
    if (!req.body.name) {
        return res.status(400).json({
          message: 'missing required parameters. refer documentation'
        })
      }
    
    Company.deleteOne({name: req.body.name})
      .then(()=>{
        return res.status(200).json({
            erroMessage: 'Deleted'
          })
      })
      .catch((err) => {
        console.log('Error:', err)
      })
    }
    else
    {
      return res.status(400).json({
        erroMessage: 'unauthorized access request'
      })
    }
})


module.exports = router