const Student = require('../models/Student');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

const registerStudent = async (req, res) => {
  try {
    const { firstName, lastName, email, age, address, password } = req.body;

    if (!firstName || !lastName || !email || !password || !address || !age) {
      return res.status(400).json({ message: 'All fields required' });
    }

    if (age < 18) {
      return res.status(400).json({ message: 'Age must be 18 or above' });
    }

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      firstName, lastName, email, age, address, password: hashedPassword
    });

    // Send confirmation email
    await sendEmail(email, 'Welcome!', 'Registration successful!');

    res.status(201).json({ message: 'Student registered', student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });

    if (!student) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { firstName, lastName, age, address, marks } = req.body;
    const student = await Student.findByIdAndUpdate(req.user.id, { firstName, lastName, age, address, marks }, { new: true });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadProfile = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.user.id, { profilePic: req.file.path }, { new: true });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerStudent, loginStudent, updateStudent, uploadProfile };
