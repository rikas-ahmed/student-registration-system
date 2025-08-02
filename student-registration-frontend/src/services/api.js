import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// ✅ Callback Version (for StudentSignup)
export const studentRegister = (data, callback) => {
  API.post('/student/register', data)
    .then((res) => callback(null, res.data))
    .catch((err) => callback(err));
};

// ✅ Async/Await version (for StudentLogin)
export const studentLogin = async (data) => {
  const res = await API.post('/student/login', data);
  return res.data;
};

// ✅ UPDATED: Now accepts a 'token' argument for authorization
export const getAllStudents = (token) => { // Added token parameter
  return API.get('/teacher/students', {
    headers: { Authorization: `Bearer ${token}` }, // Use the token for authorization
  })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

export const updateStudent = (id, data, token) =>
  API.put(`/teacher/update/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteStudent = (id, token) =>
  API.delete(`/teacher/delete/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });