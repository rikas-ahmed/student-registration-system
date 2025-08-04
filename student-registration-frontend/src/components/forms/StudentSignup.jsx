import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { studentRegister, checkAddressUniqueness  } from '../../services/api'; 
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  firstName: z.string().min(1, 'First Name is required').regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  lastName: z.string().min(1, 'Last Name is required').regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z.string().email('Invalid email'),
  age: z
    .string() 
    .refine((val) => !isNaN(val) && Number(val) >= 18, {
      message: 'Age must be a number and at least 18',
    }),
  address: z.string().min(1, 'Address is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const StudentSignup = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,   
    clearErrors 
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleAddressBlur = async (event) => {
    const address = event.target.value;
    if (address.length === 0) { 
      clearErrors('address');
      return;
    }

    clearErrors('address');

    try {
      const response = await checkAddressUniqueness(address);
      if (!response.isUnique) {
        setError('address', {
          type: 'manual',
          message: response.message 
        });
      }
    } catch (err) {
      console.error("Error during address uniqueness check:", err);
      setError('address', {
        type: 'manual',
        message: err.message || 'Could not verify address. Please try again.'
      });
    }
  };

  const onSubmit = (data) => {
    const submissionData = { ...data, age: Number(data.age) };

    studentRegister(submissionData, (error, result) => {
      if (error) {
        if (error.message.includes('Address already registered')) {
          setError('address', { type: 'manual', message: error.message });
        } else if (error.message.includes('Email already registered')) {
          setError('email', { type: 'manual', message: error.message });
        }
        alert('Registration failed: ' + error.message);
      } else {
        alert('Registration successful! Check your email.');
        navigate('/student/login');
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Student Signup</h2>

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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              {...register('email')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email?.message}</p>}
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input
              id="age"
              type="number" 
              {...register('age')}
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
              onBlur={handleAddressBlur} 
            />
            {errors.address && <p className="mt-1 text-red-500 text-sm">{errors.address?.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password"
              {...register('password')}
              type="password"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.password && <p className="mt-1 text-red-500 text-sm">{errors.password?.message}</p>}
          </div>

          <div className="flex flex-col gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isSubmitting ? 'Submitting...' : 'Sign Up'}
          </button>
          <button
              type="button" 
              onClick={() => navigate("/student/login")}
              className="w-full text-blue-600 hover:text-blue-800 text-sm font-medium p-2"
            >
              Already have an account? Login
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentSignup;