const express = require('express');
const router = express.Router();
const path = require('path');

const Excercise = require('../models/excercises');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

router.post('/api/users', async (req,res) =>{
  const user = req.body.username;
  const userExist = await Excercise.exists({ username: user });
  if (userExist) {
    res.json({ status: "This user already exist" });
  } else {
      const newUser = new Excercise ({
    username: req.body.username
  });
  await newUser.save();
  res.json(newUser);
  }
});

router.get('/api/users', async (req,res) =>{
  const allUser = await Excercise.find();
  res.json(allUser);
});

router.post('/api/users/:_id/exercises', async (req,res) =>{
  if (req.body.date === '' || (typeof req.body.date === 'undefined')) {
    await Excercise.findByIdAndUpdate({ _id: req.params._id },{
      description: req.body.description, 
      duration: req.body.duration, 
      date: new Date().toDateString()
    });
    await Excercise.findOne({ _id: req.params._id }, (err,userFound) => {
      if (err) {
        return console.log(err);
      }
      console.log(new Date(userFound.date).toDateString());
      res.json({
        "_id": userFound._id,
        "username": userFound.username,
        "date": new Date(userFound.date).toDateString(),
        "duration": userFound.duration,
        "description": userFound.description
      });
    }).clone().catch(function(err){ console.log(err)});
  } else {
    await Excercise.findByIdAndUpdate({ _id: req.params._id },{
      description: req.body.description, 
      duration: req.body.duration, 
      date: new Date(req.body.date).toDateString()
    });
    await Excercise.findOne({ _id: req.params._id }, (err,userFound) => {
      if (err) {
        return console.log(err);
      }
      res.json({
        "_id": userFound._id,
        "username": userFound.username,
        "date": new Date(userFound.date).toDateString(),
        "duration": userFound.duration,
        "description": userFound.description
      });
    }).clone().catch(function(err){ console.log(err)});
  }
});

// router.get('/api/users/:_id/logs', (req,res) => {

// });

module.exports = router;
