const express = require('express');
const router = express.Router();
const path = require('path');

const { Exercise, User } = require('../models/exercises');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

router.post('/api/users', async (req,res) =>{
  const user = req.body.username;
  const userExist = await User.exists({ username: user });
  if (userExist) {
    res.json({ status: "This user already exist" });
  } else {
    const newUser = new User ({
      username: req.body.username,
    });
    await newUser.save((err,data) => {
      if (err) {
        res.send('There was an error: ', err);
      }
      res.json({
        "_id": data._id,
        "username": data.username
      });
    });
  }
});

router.get('/api/users', async (req,res) =>{
  const allUsers = await User.find();
  res.json(allUsers);
});

router.post('/api/users/:_id/exercises', async (req,res) =>{
  if (req.body.date === '' || (typeof req.body.date === 'undefined' || req.body.date === 'Invalid Date')) {
    const newExercise = new Exercise ({
      description: req.body.description, 
      duration: req.body.duration, 
      date: new Date().toDateString()
    });  
    await newExercise.save();
    const userFound = await User.findById(req.params._id);
    userFound.count = userFound.count + 1;
    userFound.log.push(newExercise);
    const userUpdated = await userFound.save();
    res.json({
      "_id": userUpdated._id,
      "username": userUpdated.username,
      "date": new Date(newExercise.date).toDateString(),
      "duration": newExercise.duration,
      "description":newExercise.description
    });
  }
  else {
    const newExercise = new Exercise ({
      description: req.body.description, 
      duration: req.body.duration, 
      date: new Date(req.body.date).toDateString()
    });  
    await newExercise.save();
    const userFound = await User.findById(req.params._id);
    userFound.count = userFound.count + 1;
    userFound.log.push(newExercise);
    const userUpdated = await userFound.save();
    res.json({
      "_id": userUpdated._id,
      "username": userUpdated.username,
      "date": new Date(newExercise.date).toDateString(),
      "duration": newExercise.duration,
      "description":newExercise.description
    });
  }
});

router.get('/api/users/:_id/logs', async (req,res) => {
  const allUserExercises = await User.findById(req.params._id);
  let allUserExercisesArray = [];
  allUserExercisesArray = allUserExercises.log.map((data) => {
    return{
      "description": data.description,
      "duration": data.duration,
      "date": data.date.toDateString()
    }
  });
  console.log(allUserExercisesArray);
  res.json({
    "_id": allUserExercises._id,
    "username": allUserExercises.username,
    "count": allUserExercises.count,
    "log": allUserExercisesArray
  });
});

module.exports = router;