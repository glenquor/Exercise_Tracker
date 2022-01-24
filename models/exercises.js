const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.connect(process.env.MONGO_URI);

const exercisesSchema = new Schema ({
  username: { type: String, required: true },
  description: String,
  duration: Number,
  date: Date
});

module.exports = mongoose.model('exercises', exercisesSchema);