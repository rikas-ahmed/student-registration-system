import React, { useEffect, useState } from 'react';
import { getAllStudents, updateStudent, deleteStudent } from '../services/api'; 
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

const subjects = ['Art', 'ICT', 'Tamil', 'Religion', 'Commerce', 'English', 'Science', 'Mathematics', 'History'];

const schema = z.object({
  firstName: z.string()
    .min(1, 'First name required')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'), 
  lastName: z.string()
    .min(1, 'Last name required')
    .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'), 
  age: z.number({ invalid_type_error: 'Age is required' }).min(18, 'Age must be 18 or above'),
  address: z.string().min(1, 'Address required'),
  marks: z.array(z.number().min(0, 'Mark must be 0-100').max(100, 'Mark must be 0-100')).length(9, 'All 9 subject marks are required'),
});

const TeacherDashboard = () => {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const teacherToken = localStorage.getItem('teacherToken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getAllStudents(teacherToken);
        setStudents(data);
      } catch (err) {
        console.error('Error loading students:', err); 
        alert('Error loading students: ' + (err.response?.data?.message || err.message));
        
        if (err.response?.status === 401 || err.response?.status === 403) {
          alert("Session expired or unauthorized. Please log in again.");
          navigate('/teacher/login');
        }
      }
    };

    if (teacherToken) {
      fetchStudents();
    } else {
      alert("No teacher token found. Please log in as a teacher.");
      navigate('/teacher/login');
    }
  }, [teacherToken, navigate]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const openModal = (student) => {
    setEditingStudent(student);
    
    reset({
      firstName: student.firstName,
      lastName: student.lastName,
      age: student.age,
      address: student.address,
      marks: Array.isArray(student.marks) && student.marks.length === 9
        ? student.marks.map(mark => typeof mark === 'number' ? mark : 0) 
        : Array(9).fill(0), 
    });
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    try {
      await updateStudent(editingStudent._id, data, teacherToken);
      alert('Student updated successfully!');
      setShowModal(false);
      const updatedStudents = await getAllStudents(teacherToken);
      setStudents(updatedStudents);
    } catch (err) {
      console.error('Error updating student:', err);
      alert('Update failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) return;
    try {
      await deleteStudent(id, teacherToken);
      alert('Student deleted successfully!');
      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error('Error deleting student:', err);
      alert('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('teacherToken');
    alert('Logged out successfully!');
    navigate('/');
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-gray-50 rounded-lg shadow-inner">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Teacher Dashboard</h2>

      <div className="flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Logout
        </button>
      </div>

      {students.length === 0 && !teacherToken ? (
        <p className="text-center text-gray-600 text-lg">Please log in as a teacher to view student records.</p>
      ) : students.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No students found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <div key={student._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              {student.profilePic && (
                <img
                  src={`http://localhost:5000/${student.profilePic}`}
                  alt={`${student.firstName}'s profile`}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-blue-400"
                />
              )}
              <h3 className="text-xl font-semibold mb-2 text-blue-700">
                {student.firstName} {student.lastName}
              </h3>
              <p className="text-gray-700 text-sm mb-1"><strong>Email:</strong> {student.email}</p>
              <p className="text-gray-700 text-sm mb-1"><strong>Age:</strong> {student.age}</p>
              <p className="text-gray-700 text-sm mb-2"><strong>Address:</strong> {student.address}</p>

              <p className="mt-3 font-medium text-gray-800">Marks:</p>
              <ul className="list-disc ml-6 text-gray-600 text-sm">
                {student.marks && student.marks.length === subjects.length ? ( 
                  student.marks.map((mark, i) => (
                    <li key={i}>{subjects[i]}: {mark}</li>
                  ))
                ) : (
                  <li>No marks available or incomplete marks data.</li> 
                )}
              </ul>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => openModal(student)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(student._id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-[9999]">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"> 
            <h3 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Edit Student</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="editFirstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  id="editFirstName"
                  {...register('firstName')}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="First Name"
                />
                {errors.firstName && <p className="mt-1 text-red-500 text-sm">{errors.firstName?.message}</p>}
              </div>

              <div>
                <label htmlFor="editLastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  id="editLastName"
                  {...register('lastName')}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Last Name"
                />
                {errors.lastName && <p className="mt-1 text-red-500 text-sm">{errors.lastName?.message}</p>}
              </div>

              <div>
                <label htmlFor="editAge" className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  id="editAge"
                  type="number"
                  {...register('age', { valueAsNumber: true })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Age"
                />
                {errors.age && <p className="mt-1 text-red-500 text-sm">{errors.age?.message}</p>}
              </div>

              <div>
                <label htmlFor="editAddress" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  id="editAddress"
                  {...register('address')}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Address"
                />
                {errors.address && <p className="mt-1 text-red-500 text-sm">{errors.address?.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subjects.map((subject, index) => (
                  <div key={subject}>
                    <label htmlFor={`editMark-${index}`} className="block text-sm font-medium text-gray-700 mb-1">{subject} Mark</label>
                    <Controller
                      name={`marks.${index}`}
                      control={control}
                      render={({ field }) => (
                        <input
                          id={`editMark-${index}`}
                          type="number"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          {...field}
                          onChange={(e) => { 
                            const value = e.target.value;
                            field.onChange(value === '' ? '' : parseInt(value)); 
                          }}
                          min="0"
                          max="100"
                        />
                      )}
                    />
                    {errors.marks?.[index] && <p className="mt-1 text-red-500 text-sm">{errors.marks[index]?.message}</p>}
                  </div>
                ))}
              </div>
              {errors.marks && <p className="mt-1 text-red-500 text-sm">{errors.marks?.message}</p>}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;