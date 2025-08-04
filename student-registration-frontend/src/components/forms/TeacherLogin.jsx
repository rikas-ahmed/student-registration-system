import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const TeacherLogin = () => {
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
      const res = await axios.post("http://localhost:5000/api/teacher/login", data);
      localStorage.setItem("teacherToken", res.data.token); 
      alert("Teacher login successful!");
      navigate("/teacher/dashboard");
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 border border-gray-200"> 
        <div className="text-center mb-6"> 
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Teacher Login</h2>
          <p className="text-gray-600">
            Enter your email and password to login
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4"> 
          <div> 
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label> 
            <input
              id="email"
              {...register("email")}
              placeholder="you@example.com"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
            />
            {errors.email && (
              <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div> 
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
            />
            {errors.password && (
              <p className="mt-1 text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-4"> 
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
            <button
              type="button" 
              onClick={() => navigate("/teacher/signup")}
              className="w-full text-blue-600 hover:text-blue-800 text-sm font-medium p-2" 
            >
              Don’t have an account? Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherLogin;