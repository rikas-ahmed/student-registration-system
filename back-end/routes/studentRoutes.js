const express = require('express');
const { registerStudent, loginStudent, updateStudent, uploadProfile } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../utils/upload');

const router = express.Router();

router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.put('/update', protect, updateStudent);
router.post('/upload', protect, upload.single('profilePic'), uploadProfile);

module.exports = router;
