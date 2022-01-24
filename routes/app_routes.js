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
  if (req.body.date === '') {
    console.log('re.body.date is empty, undefined or null');
    await Excercise.findByIdAndUpdate({ _id: req.params._id },{
      description: req.body.description, 
      duration: req.body.duration, 
      date: new Date().toISOString()
    });
  } else {
    console.log("re.body.date isn't empty, undefined or null");
    await Excercise.findByIdAndUpdate({ _id: req.params._id },{
      description: req.body.description, 
      duration: req.body.duration, 
      date: req.body.date 
    });
  }
  const userExc = await Excercise.findById({ _id: req.params._id });
  res.json(userExc);
});

module.exports = router;
