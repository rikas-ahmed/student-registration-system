// components/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion"; // Remove if you don't want animations at all

const Home = () => {
  const navigate = useNavigate();

  return (
    <div // Changed from motion.div for simplicity, can re-add if needed
      className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center px-6 py-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full">
        {[
          {
            title: "Student Portal",
            desc: "Register, login, update profile and marks.",
            loginPath: "/student/login",
            signupPath: "/student/register",
            // Removed custom color property
          },
          {
            title: "Teacher Portal",
            desc: "Login to view or manage student records.",
            loginPath: "/teacher/login",
            signupPath: "/teacher/signup",
            // Removed custom color property
          },
        ].map((portal, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200" // Simple card styling
          >
            <div className="text-center flex flex-col items-center gap-4">
              <h2 className="text-2xl font-semibold text-gray-800">{portal.title}</h2>
              <p className="text-gray-600">{portal.desc}</p>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => navigate(portal.loginPath)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" // Basic button
                >
                  Login
                </button>
                <button
                  onClick={() => navigate(portal.signupPath)}
                  className="px-6 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors" // Outline button
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;