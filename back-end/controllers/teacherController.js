const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

const registerTeacher = async (req, res) => {
  try {
    const { firstName, lastName, email, age, address, password } = req.body;

    if (!firstName || !lastName || !email || !password || !address || !age) {
      return res.status(400).json({ message: 'All fields required' });
    }

    if (age < 18) {
      return res.status(400).json({ message: 'Age must be 18 or above' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = await Teacher.create({
      firstName, lastName, email, age, address, password: hashedPassword
    });

    await sendEmail(email, 'Welcome!', 'Teacher account created successfully.');

    res.status(201).json({ message: 'Teacher registered', teacher });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;
    const teacher = await Teacher.findOne({ email });

    if (!teacher) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: teacher._id, role: 'teacher' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStudentByTeacher = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerTeacher, loginTeacher, getAllStudents, updateStudentByTeacher, deleteStudent };
