const express = require('express');
const { registerTeacher, loginTeacher, getAllStudents, updateStudentByTeacher, deleteStudent } = require('../controllers/teacherController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerTeacher);
router.post('/login', loginTeacher);
router.get('/students', protect, getAllStudents);
router.put('/update/:id', protect, updateStudentByTeacher);
router.delete('/delete/:id', protect, deleteStudent);

module.exports = router;
