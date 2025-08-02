// components/form/studentlogin.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentLogin } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const StudentLogin = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const result = await studentLogin(data);
      localStorage.setItem('studentToken', result.token);
      alert('Login successful!');
      navigate('/student/profile');
    } catch (error) {
      alert('Login failed: ' + error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4"> {/* Added basic background */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8"> {/* Card replacement */}
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Student Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label> {/* Label */}
            <input
              id="email"
              {...register('email')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" // Input styling
            />
            {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email?.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password"
              {...register('password')}
              type="password"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" // Input styling
            />
            {errors.password && <p className="mt-1 text-red-500 text-sm">{errors.password?.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" // Button styling
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentLogin;