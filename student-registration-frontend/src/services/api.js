import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const studentRegister = (data, callback) => {
  API.post('/student/register', data)
    .then((res) => callback(null, res.data))
    .catch((err) => {
      let errorMessage = 'Registration failed. An unknown error occurred.';
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message; 
      } else if (err.message) {
        errorMessage = err.message; 
      }
      callback(new Error(errorMessage)); 
    });
};

export const studentLogin = async (data) => {
  const res = await API.post('/student/login', data);
  return res.data;
};

export const getAllStudents = (token) => { 
  return API.get('/teacher/students', {
    headers: { Authorization: `Bearer ${token}` }, 
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

export const checkAddressUniqueness = async (address) => {
  try {
    const res = await API.post('/student/check-address', { address });
    return res.data; 
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    }
    throw new Error('Could not verify address uniqueness. Please try again.');
  }
};  