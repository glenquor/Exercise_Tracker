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
  if (req.body.date === '' || req.body.date === undefined) {
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
  const { to, limit } = req.query;
  const fromP = req.query.from;
  const allUserExercises = await User.findById(req.params._id);
  let allUserExercisesArray = [];
  // all of them are undefined
  if (fromP === undefined && to === undefined && limit === undefined) {
    allUserExercisesArray = allUserExercises.log.map((data) => {
      return{
        "description": data.description,
        "duration": data.duration,
        "date": data.date.toDateString()
      }
    });
    res.json({
      "_id": allUserExercises._id,
      "username": allUserExercises.username,
      "count": allUserExercises.count,
      "log": allUserExercisesArray
    }); 
  }
  // Just 'limit' undefined
  else if(fromP !== undefined && to !== undefined && limit === undefined) {
    const filtered = allUserExercises.log.filter(data => {
      return data.date >= new Date(fromP) && data.date <= new Date(to);
    });
    allUserExercisesArray = filtered.map((data) => {
      return{
        "description": data.description,
        "duration": data.duration,
        "date": data.date.toDateString()
      }
    });
    res.json({
      "_id": allUserExercises._id,
      "username": allUserExercises.username,
      "from": new Date(fromP).toDateString(),
      "to": new Date(to).toDateString(),
      "count":  allUserExercisesArray.length,
      "log": allUserExercisesArray
    }); 
  }
  // 'fromP' and 'limit' undefined
  else if(fromP === undefined && to !== undefined && limit === undefined) {
    const filtered = allUserExercises.log.filter(data => {
      return data.date <= new Date(to);
    });
    allUserExercisesArray = filtered.map((data) => {
      return{
        "description": data.description,
        "duration": data.duration,
        "date": data.date.toDateString()
      }
    });        
    res.json({
      "_id": allUserExercises._id,
      "username": allUserExercises.username,
      "to": new Date(to).toDateString(),
      "count":  allUserExercisesArray.length,
      "log": allUserExercisesArray
    }); 
  }
  // 'to' and 'limit' undefined
  else if(fromP !== undefined && to === undefined && limit === undefined) {
    const filtered = allUserExercises.log.filter(data => {
      return data.date >= new Date(fromP);
    });
    allUserExercisesArray = filtered.map((data) => {
      return{
        "description": data.description,
        "duration": data.duration,
        "date": data.date.toDateString()
      }
    });        
    res.json({
      "_id": allUserExercises._id,
      "username": allUserExercises.username,
      "from": new Date(fromP).toDateString(),
      "count":  allUserExercisesArray.length,
      "log": allUserExercisesArray
    }); 
  }
  // Just 'fromP' undefined
  else if(fromP === undefined && to !== undefined && limit !== undefined) {
    const filtered = allUserExercises.log.filter(data => {
      return data.date <= new Date(to);
    });
    limitInt = parseInt(limit);
    if (0 < limitInt && limitInt <= filtered.length) {
      for (let i=0; i<limitInt; i++) {
        allUserExercisesArray.push({
          "description": filtered[filtered.length-1-i].description,
          "duration": filtered[filtered.length-1-i].duration,
          "date": filtered[filtered.length-1-i].date.toDateString()
        });
      }
      res.json({
        "_id": allUserExercises._id,
        "username": allUserExercises.username,
        "to": new Date(to).toDateString(),
        "count":  allUserExercisesArray.length,
        "log": allUserExercisesArray
      });  
    }
    else { // filtered.length menor limit
      allUserExercisesArray = filtered.map((data) => {
        return{
          "description": data.description,
          "duration": data.duration,
          "date": data.date.toDateString()
        }
      });
      res.json({
        "_id": allUserExercises._id,
        "username": allUserExercises.username,
        "to": new Date(to).toDateString(),
        "count":  allUserExercisesArray.length,
        "log": allUserExercisesArray
      });  
    }
  }
  // Just 'to' undefined
  else if(fromP !== undefined && to === undefined && limit !== undefined) {
    const filtered = allUserExercises.log.filter(data => {
      return data.date >= new Date(fromP);
    });
    limitInt = parseInt(limit);
    if (0 < limitInt && limitInt <= filtered.length) {
      for (let i=0; i<limitInt; i++) {
        allUserExercisesArray.push({
          "description": filtered[filtered.length-1-i].description,
          "duration": filtered[filtered.length-1-i].duration,
          "date": filtered[filtered.length-1-i].date.toDateString()
        });
      }
      res.json({
        "_id": allUserExercises._id,
        "username": allUserExercises.username,
        "from": new Date(fromP).toDateString(),
        "count":  allUserExercisesArray.length,
        "log": allUserExercisesArray
      });  
    }
    else { // filtered.length menor limit
      allUserExercisesArray = filtered.map((data) => {
        return{
          "description": data.description,
          "duration": data.duration,
          "date": data.date.toDateString()
        }
      }); 
      res.json({
        "_id": allUserExercises._id,
        "username": allUserExercises.username,
        "from": new Date(fromP).toDateString(),
        "count":  allUserExercisesArray.length,
        "log": allUserExercisesArray
      });  
    }
  }
  // 'from' and 'to' undefined
  else if(fromP === undefined && to === undefined && limit !== undefined) {
    limitInt = parseInt(limit);
    if (0 < limitInt && limitInt <= allUserExercises.log.length) {
      for (let i=0; i<limitInt; i++) {
        allUserExercisesArray.push({
          "description": allUserExercises.log[allUserExercises.log.length-1-i].description,
          "duration": allUserExercises.log[allUserExercises.log.length-1-i].duration,
          "date": allUserExercises.log[allUserExercises.log.length-1-i].date.toDateString()
        });
      }
      res.json({
        "_id": allUserExercises._id,
        "username": allUserExercises.username,
        "from": new Date(fromP).toDateString(),
        "count":  allUserExercisesArray.length,
        "log": allUserExercisesArray
      });  
    }
    else { // filtered.length menor limit
      allUserExercisesArray = allUserExercises.log.map((data) => {
        return{
          "description": data.description,
          "duration": data.duration,
          "date": data.date.toDateString()
        }
      }); 
      res.json({
        "_id": allUserExercises._id,
        "username": allUserExercises.username,
        "from": new Date(fromP).toDateString(),
        "count":  allUserExercisesArray.length,
        "log": allUserExercisesArray
      });  
    }
  }
  // neither of them are undefined
  else {
    const filtered = allUserExercises.log.filter(data => {
      return data.date >= new Date(fromP) && data.date <= new Date(to);
    });
    limitInt = parseInt(limit);
    if (0 < limitInt && limitInt <= filtered.length) {
      for (let i=0; i<limitInt; i++) {
        allUserExercisesArray.push({
          "description": filtered[filtered.length-1-i].description,
          "duration": filtered[filtered.length-1-i].duration,
          "date": filtered[filtered.length-1-i].date.toDateString()
        });
      }
      res.json({
        "_id": allUserExercises._id,
        "username": allUserExercises.username,
        "from": new Date(fromP).toDateString(),
        "to": new Date(to).toDateString(),
        "count":  allUserExercisesArray.length,
        "log": allUserExercisesArray
      });  
    }
    else { // filtered.length menor limit
      allUserExercisesArray = filtered.map((data) => {
        return{
          "description": data.description,
          "duration": data.duration,
          "date": data.date.toDateString()
        }
      }); 
      res.json({
        "_id": allUserExercises._id,
        "username": allUserExercises.username,
        "from": new Date(fromP).toDateString(),
        "to": new Date(to).toDateString(),
        "count":  allUserExercisesArray.length,
        "log": allUserExercisesArray
      });  
    }
  }
});

module.exports = router;