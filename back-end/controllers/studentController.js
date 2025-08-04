const Student = require('../models/Student');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail'); 

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const registerStudent = async (req, res) => {
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

        const hashedPassword = await bcrypt.hash(password, 10);

        const student = await Student.create({
            firstName, lastName, email, age, address, password: hashedPassword,
            marks: Array(9).fill(0)
        });

        await sendEmail(email, 'Welcome!', 'Registration successful!');

        res.status(201).json({
            message: 'Student registered successfully! Please check your email.',
            token: generateToken(student._id),
            student: {
                id: student._id,
                firstName: student.firstName,
                lastName: student.lastName,
                email: student.email,
                age: student.age,
                address: student.address,
                marks: student.marks 
            }
        });

    } catch (error) {
        console.error("Error during student registration:", error);

        if (error.code === 11000) {
            if (error.keyPattern.email) {
                return res.status(400).json({ message: 'Email already registered. Please use a unique email.' });
            }
            if (error.keyPattern.address) {
                return res.status(400).json({ message: 'Address already registered. Please use a unique address.' });
            }
        }

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        
        res.status(500).json({ message: error.message || 'Server error during registration.' });
    }
};

const loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;
        const student = await Student.findOne({ email });

        if (!student) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = generateToken(student._id); 
        res.json({ token, message: 'Logged in successfully!' });
    } catch (error) {
        console.error("Error during student login:", error);
        res.status(500).json({ message: error.message || 'Server error during login.' });
    }
};

const getStudentProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id).select('-password');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        console.error("Error getting student profile:", error);
        res.status(500).json({ message: error.message || 'Server error fetching profile.' });
    }
};

const updateStudent = async (req, res) => {
    try {
        const { firstName, lastName, age, address, marks } = req.body;

        const updateData = {};
        if (firstName !== undefined) updateData.firstName = firstName;
        if (lastName !== undefined) updateData.lastName = lastName;
        if (age !== undefined) updateData.age = age;
        if (address !== undefined) updateData.address = address;
        if (marks !== undefined) {
            updateData.marks = marks;
        }

        const student = await Student.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true, runValidators: true } 
        );

        if (!student) {
            return res.status(404).json({ message: 'Student not found.' });
        }

        res.status(200).json({ message: 'Profile updated successfully!', student });
    } catch (error) {
        console.error("Detailed error updating student profile:", error); 

        if (error.code === 11000) {
            if (error.keyPattern.address) {
                return res.status(400).json({ message: 'Address already in use. Please use a unique address.' });
            }
            if (error.keyPattern.email) {
                return res.status(400).json({ message: 'Email already in use. This should not be updatable via this route.' }); 
            }
        }
        if (error.name === 'ValidationError') { 
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: error.message || 'Server error during profile update.' });
    }
};

const uploadProfile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const student = await Student.findByIdAndUpdate(req.user.id, { profilePic: req.file.path }, { new: true });
        if (!student) {
            return res.status(404).json({ message: 'Student not found for profile picture upload.' });
        }
        res.status(200).json({ message: 'Profile picture uploaded successfully!', profilePic: student.profilePic });
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        res.status(500).json({ message: error.message || 'Server error during profile picture upload.' });
    }
};


const checkAddressUniqueness = async (req, res) => {
    try {
        const { address } = req.body;
        if (!address) {
            return res.status(400).json({ message: 'Address is required for uniqueness check.' });
        }

        const student = await Student.findOne({ address });
        if (student) {
            return res.status(200).json({ isUnique: false, message: 'This address is already registered.' });
        } else {
            return res.status(200).json({ isUnique: true, message: 'Address is available.' });
        }
    } catch (error) {
        console.error("Error checking address uniqueness:", error);
        res.status(500).json({ message: error.message || 'Server error during address uniqueness check.' });
    }
};

module.exports = { registerStudent, loginStudent, updateStudent, uploadProfile, getStudentProfile, checkAddressUniqueness };