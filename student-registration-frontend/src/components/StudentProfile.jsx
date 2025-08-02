import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

const subjects = ['Art', 'ICT', 'Tamil', 'Religion', 'Commerce', 'English', 'Science', 'Mathematics', 'History'];

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  age: z
    .number({ invalid_type_error: 'Age is required' })
    .min(18, 'Age must be 18 or above'),
  address: z.string().min(1, 'Address is required'),
  marks: z
    .array(z.number().min(0).max(100))
    .length(9, 'All 9 subject marks are required'),
});

const StudentProfile = () => {
  const token = localStorage.getItem('studentToken');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [picURL, setPicURL] = useState('');

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      age: '', // Keep as string or null for initial empty state, let zod handle number conversion on submit
      address: '',
      marks: Array(9).fill(0),
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // IMPORTANT: If this is a student profile, it should fetch *their* profile, not all students for a teacher.
        // Assuming your backend has an endpoint like /api/student/profile that uses the studentToken
        const res = await axios.get('http://localhost:5000/api/student/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const student = res.data; // Assuming res.data is the student object

        if (student) {
          reset({
            firstName: student.firstName,
            lastName: student.lastName,
            age: student.age,
            address: student.address,
            marks: student.marks || Array(9).fill(0),
          });
          setPicURL(student.profilePic || '');
        }
      } catch (err) {
        console.error('Profile load error', err);
        alert('Failed to load profile. Please log in again.');
        // Optionally redirect to login if token is invalid
      } finally {
        setLoading(false);
      }
    };

    if (token) { // Only fetch if token exists
      fetchProfile();
    } else {
      setLoading(false); // No token, stop loading
      alert("No student token found. Please log in.");
      // navigate('/student/login'); // Consider redirecting if no token
    }
  }, [reset, token]); // Add reset and token to dependencies

  const onSubmit = async (data) => {
    try {
      await axios.put('http://localhost:5000/api/student/update', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Profile updated!');
    } catch (err) {
      alert('Error updating: ' + err.response?.data?.message || err.message);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('profilePic', file);
    setUploading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/student/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setPicURL(res.data.profilePic);
      alert('Profile picture uploaded!');
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="text-center p-10 text-xl text-gray-700">Loading profile...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Student Profile</h2>

        {picURL && (
          <img src={`http://localhost:5000/${picURL}`} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-2 border-blue-500 shadow-md" />
        )}
        <div className="mb-6">
          <label htmlFor="profilePicUpload" className="block text-sm font-medium text-gray-700 mb-1">Upload Profile Picture</label>
          <input
            id="profilePicUpload"
            type="file"
            onChange={handleUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            accept="image/*"
            disabled={uploading}
          />
          {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              id="firstName"
              {...register('firstName')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.firstName && <p className="mt-1 text-red-500 text-sm">{errors.firstName?.message}</p>}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              id="lastName"
              {...register('lastName')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.lastName && <p className="mt-1 text-red-500 text-sm">{errors.lastName?.message}</p>}
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input
              id="age"
              type="number"
              {...register('age', { valueAsNumber: true })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.age && <p className="mt-1 text-red-500 text-sm">{errors.age?.message}</p>}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              id="address"
              {...register('address')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.address && <p className="mt-1 text-red-500 text-sm">{errors.address?.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject, index) => (
              <div key={subject}>
                <label htmlFor={`mark-${index}`} className="block text-sm font-medium text-gray-700 mb-1">{subject} Mark</label>
                <Controller
                  name={`marks.${index}`}
                  control={control}
                  render={({ field }) => (
                    <input
                      id={`mark-${index}`}
                      type="number"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      {...field}
                      min="0"
                      max="100"
                    />
                  )}
                />
              </div>
            ))}
          </div>
          {errors.marks && <p className="mt-1 text-red-500 text-sm">{errors.marks?.message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isSubmitting ? 'Saving...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentProfile;