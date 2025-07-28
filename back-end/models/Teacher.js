const mongoose = require('mongoose');

const teacherSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  age: { type: Number, min: 18, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  profilePic: { type: String },
});

module.exports = mongoose.model('Teacher', teacherSchema);
