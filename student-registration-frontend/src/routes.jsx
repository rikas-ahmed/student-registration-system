import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StudentSignup from './components/forms/StudentSignup';
import StudentLogin from './components/forms/StudentLogin';
import StudentProfile from './components/StudentProfile';
import TeacherSignup from './components/forms/TeacherSignup';
import TeacherLogin from './components/forms/TeacherLogin';
import TeacherDashboard from './components/TeacherDashboard';
import Home from './components/Home';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/student/register" element={<StudentSignup />} />
      <Route path="/student/login" element={<StudentLogin />} />
      <Route path="/student/profile" element={<StudentProfile />} />
      <Route path="/teacher/signup" element={<TeacherSignup />} />
      <Route path="/teacher/login" element={<TeacherLogin />} />
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
    </Routes>
  );
};

export default AppRoutes;
