const mongoose = require('mongoose');
const { Schema } = mongoose;
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../sample.env') });

mongoose.connect(process.env.MONGO_URI);

let exercisesSchema = new Schema ({
  description: String,
  duration: Number,
  date: Date
});

let userSchema = new Schema ({
  username: { type: String, required: true },
  count: {type: Number, default: 0},
  log: [exercisesSchema]
});

let Exercise = mongoose.model('exercises', exercisesSchema);
let User = mongoose.model('users', userSchema);

module.exports = { Exercise, User };