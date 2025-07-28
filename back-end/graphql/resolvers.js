const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const resolvers = {
  students: async () => {
    return await Student.find();
  },
  teachers: async () => {
    return await Teacher.find();
  },

  registerStudent: async ({ input }) => {
    const { firstName, lastName, email, age, address, password } = input;
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({ firstName, lastName, email, age, address, password: hashedPassword });
    await student.save();
    return student;
  },

  loginStudent: async ({ email, password }) => {
    const student = await Student.findOne({ email });
    if (!student) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token };
  },

  registerTeacher: async ({ input }) => {
    const { firstName, lastName, email, age, address, password } = input;
    const hashedPassword = await bcrypt.hash(password, 10);
    const teacher = new Teacher({ firstName, lastName, email, age, address, password: hashedPassword });
    await teacher.save();
    return teacher;
  },

  loginTeacher: async ({ email, password }) => {
    const teacher = await Teacher.findOne({ email });
    if (!teacher) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const token = jwt.sign({ id: teacher._id, role: 'teacher' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token };
  },

  updateStudent: async ({ id, firstName, lastName, age, address, marks }) => {
    const student = await Student.findByIdAndUpdate(
      id,
      { firstName, lastName, age, address, marks },
      { new: true }
    );
    return student;
  },

  deleteStudent: async ({ id }) => {
    await Student.findByIdAndDelete(id);
    return 'Student deleted successfully';
  }
};

module.exports = resolvers;
