import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center px-6 py-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full">
        {[
          {
            title: "Student Portal",
            desc: "Register, login, update profile and marks.",
            loginPath: "/student/login",
            signupPath: "/student/register",
          },
          {
            title: "Teacher Portal",
            desc: "Login to view or manage student records.",
            loginPath: "/teacher/login",
            signupPath: "/teacher/signup",
          },
        ].map((portal, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200" 
          >
            <div className="text-center flex flex-col items-center gap-4">
              <h2 className="text-2xl font-semibold text-gray-800">{portal.title}</h2>
              <p className="text-gray-600">{portal.desc}</p>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => navigate(portal.loginPath)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" 
                >
                  Login
                </button>
                <button
                  onClick={() => navigate(portal.signupPath)}
                  className="px-6 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors" 
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