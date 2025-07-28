const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  age: { type: Number, min: 18, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  profilePic: { type: String },
  marks: { type: [Number], default: Array(9).fill(0) }
});

module.exports = mongoose.model('Student', studentSchema);
