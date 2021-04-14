const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const csv = require("csv-parser");
const verify = require("./verifyToken");
const fs = require("fs");
const directoryPath = path.join(__dirname, "../uploads");

const Company = require("../models/Company");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    const name = originalname;
    console.log(name);
    cb(null, name);
  },
});
const upload = multer({ storage });

router.post("/add", verify, (req, res) => {
  if (req.user._id === process.env.ADMIN ) {
    if (
      !req.body.name ||
      !req.body.description ||
      !req.body.startTime ||
      !req.body.endTime
    ) {
      return res.status(400).json({
        errorMessage: "Missing Required Params",
      });
    }

    Company.findOne({ name: req.body.name })
      .then((company) => {
        if (company) {
          return res.status(400).json({
            errorMessage: "Company Already Exists!",
          });
        } else {
          const name = req.body.name;
          const description = req.body.description;
          const tags = req.body.tags;

          const newCompany = new Company({
            name,
            description,
            tags,
          });

          const slotData = {
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            bookedBy: [],
            available: req.body.available,
            total: req.body.total,
          };

          newCompany.slots = [slotData];

          newCompany
            .save()
            .then((company) => {
              return res.status(200).json({
                message: "success",
              });
            })
            .catch((err) => {
              return res.status(400).json({
                errorMessage: err,
              });
            });
        }
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  } else {
    return res.status(400).json({
      errorMessage: "Unauthorized Access!",
    });
  }
});

router.get("/getAll", verify, (req, res) => {
  Company.find().then((infos) => {
    res.status(200).json(infos);
  });
});

router.post("/getData", verify, (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({
      errorMessage: "Missing Required Params",
    });
  }

  Company.findOne({ name: req.body.name })
    .then((company) => {
      if (!company) {
        return res.status(400).json({
          errorMessage: "company does not exist",
        });
      } else {
        return res.status(200).json(company);
      }
    })
    .catch((err) => {
      console.log("Error:", err);
    });
});

router.post("/addSlot", verify, (req, res) => {
  if (req.user._id === process.env.ADMIN ) {
    if (!req.body.name || !req.body.startTime || !req.body.endTime) {
      return res.status(400).json({
        errorMessage: "Missing Required Params",
      });
    }

    Company.findOne({ name: req.body.name })
      .then((company) => {
        if (!company) {
          return res.status(400).json({
            errorMessage: "Company doesn't exist!",
          });
        } else {
          const slots = company.slots;

          const slotData = {
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            bookedBy: [],
            available: req.body.total,
            total: req.body.total,
          };

          slots.push(slotData);

          Company.updateOne({ name: req.body.name }, { $set: { slots: slots } })
            .then((update) => {
              res.status(200).json({
                message: "details updated in db",
              });
            })
            .catch((err) => {
              console.log("Error:", err);
            });
        }
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  } else {
    return res.status(400).json({
      errorMessage: "Unauthorized Access!",
    });
  }
});

router.patch("/updateSlot", verify, (req, res) => {
  if (req.user._id === process.env.ADMIN) {
    if (
      !req.body.name ||
      !req.body.id ||
      !req.body.startTime ||
      !req.body.endTime
    ) {
      return res.status(400).json({
        errorMessage: "Missing Required Params",
      });
    }

    Company.findOne({ name: req.body.name })
      .then((company) => {
        if (!company) {
          return res.status(400).json({
            errorMessage: "Company doesn't Exist!",
          });
        } else {
          const slots = company.slots;

          for (let i = 0; i < slots.length; i++) {
            if (slots[i]._id.equals(req.body.id)) {
              slots[i].startTime = req.body.startTime;
              slots[i].endTime = req.body.endTime;
              if (req.body.available) {
                slots[i].available = req.body.available;
              }
              if (req.body.total) {
                slots[i].total = req.body.total;
              }
            }
          }

          Company.updateOne({ name: req.body.name }, { $set: { slots: slots } })
            .then((update) => {
              res.status(200).json({
                message: "slot updated, details updated in db",
              });
            })
            .catch((err) => {
              console.log("Error:", err);
            });
        }
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  } else {
    return res.status(400).json({
      errorMessage: "Unauthorized Access!",
    });
  }
});

router.delete("/deleteSlot", verify, (req, res) => {
  if (req.user._id === process.env.ADMIN) {
    if (!req.body.name || !req.body.id) {
      return res.status(400).json({
        errorMessage: "Missing Required Params",
      });
    }

    Company.findOne({ name: req.body.name })
      .then((company) => {
        if (!company) {
          return res.status(400).json({
            errorMessage: "Company doesn't exist",
          });
        } else {
          const slots = company.slots;

          for (let i = 0; i < slots.length; i++) {
            if (slots[i]._id.equals(req.body.id)) {
              slots.splice(i, 1);
            }
          }

          Company.updateOne({ name: req.body.name }, { $set: { slots: slots } })
            .then((update) => {
              res.status(200).json({
                message: "slot deleted, details updated in db",
              });
            })
            .catch((err) => {
              console.log("Error:", err);
            });
        }
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  } else {
    return res.status(400).json({
      errorMessage: "Unauthorized Access!",
    });
  }
});

router.delete("/deleteCompany", verify, (req, res) => {
  if (req.user._id === process.env.ADMIN) {
    if (!req.body.name) {
      return res.status(400).json({
        message: "Missing Required Params",
      });
    }

    Company.deleteOne({ name: req.body.name })
      .then(() => {
        return res.status(200).json({
          Message: "Deleted",
        });
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  } else {
    return res.status(400).json({
      errorMessage: "Unauthorized Access!",
    });
  }
});

router.post("/uploadCSV", verify, upload.single("file"), (req, res) => {
  if (req.user._id === process.env.ADMIN ) {
    const companies = [];
    fs.createReadStream("./uploads/expoFinal.csv")
      .pipe(csv())
      .on("data", (row) => {
        const data1 = {};
        data1.name = row.name;
        data1.description = row.description;
        data1.tags = row.tags.split(",");
        data1.workFrom = row.workFrom;
        companies.push(data1);
      })
      .on("end", () => {
        Company.insertMany(companies)
          .then(() => {
            // delete file named 'sample.txt'
            fs.unlink('./uploads/expoFinal.csv', function (err) {
              if (err) console.log("err:",err);
              // if no error, file has been deleted successfully
              return res.status(200).json({
                message: "success added all companies",
              });
            });
          })
          .catch((error) => {
            console.log(error);
            return res.status(400).json({
              errorMessage: error,
            });
          });
      });
  } else {
    return res.status(400).json({
      errorMessage: "Unauthorized Access!",
    });
  }
});

module.exports = router;
