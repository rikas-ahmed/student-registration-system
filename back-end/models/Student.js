const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({ 
  firstName: { type: String, required: true, match: [/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'] },
  lastName: { type: String, required: true, match: [/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'] },
  email: { type: String, unique: true, required: true, match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please use a valid email address'] },
  age: { type: Number, min: 18, required: true },
  address: { type: String, required: true, unique: true},
  password: { type: String, required: true },
  profilePic: { type: String },
  marks: {
    type: [Number], 
    default: Array(9).fill(0), 
    validate: { 
      validator: function(v) {
        return Array.isArray(v) && v.length === 9 && v.every(mark => typeof mark === 'number' && mark >= 0 && mark <= 100);
      },
      message: props => `${props.value} is not a valid array of 9 marks (0-100)!`
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);