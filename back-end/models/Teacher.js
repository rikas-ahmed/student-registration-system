const mongoose = require('mongoose');

const teacherSchema = mongoose.Schema({
  firstName: { type: String, required: true, match: [/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'] },
  lastName: { type: String, required: true, match: [/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'] },
  email: { type: String, unique: true, required: true, match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please use a valid email address'] },
  age: { type: Number, min: 18, required: true },
  address: { type: String, required: true, unique: true }, 
  password: { type: String, required: true },
  profilePic: { type: String },
});

module.exports = mongoose.model('Teacher', teacherSchema);
