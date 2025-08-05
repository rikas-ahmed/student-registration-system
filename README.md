# Student-Registration-System

A full-stack web application for managing student registrations, profiles, and academic marks, with separate interfaces for students and teachers.

## Table of Contents

1.Features
2.Technologies Used
3.Project Structure
4.Usage

## Features
This system provides comprehensive functionalities for both students and teachers:
### Student Features:
*Registration: Students can create new accounts.
*Login: Secure login for registered students.
*Profile Management: Students can view and update their personal details (first name, last name, age, address).
*Profile Picture Upload: Students can upload and update their profile pictures.
*View Marks: Students can view and update their marks across various subjects.
*Logout: Securely log out from their profile.
### Teacher Features:
*Registration: Teachers can create new accounts.
*Login: Secure login for registered teachers.
*Teacher Dashboard: View a list of all registered students.
*Student Management (CRUD):
*Edit Student Details: Update student's personal information and marks.
*Delete Student: Remove student records from the system.
*Logout: Securely log out from their dashboard.

### General Features:
*Authentication & Authorization: Secure access control using JWT (JSON Web Tokens).
*Form Validation: Client-side validation using Zod and React Hook Form for immediate feedback, and server-side validation for data integrity (e.g., unique email/address).
*Responsive UI: Designed with Tailwind CSS for a modern and adaptive user experience.

### Technologies Used
The project is built using a MERN stack with additional libraries for enhanced functionality.
#### Frontend:
*React.js: A JavaScript library for building user interfaces.
*React Router DOM: For declarative routing within the application.
*Tailwind CSS: A utility-first CSS framework for rapid UI development.
*React Hook Form: For efficient and flexible form management with validation.
*Zod: A TypeScript-first schema declaration and validation library.
*Axios: A promise-based HTTP client for making API requests.
#### Backend:
*Node.js: JavaScript runtime environment.
*Express.js: A fast, unopinionated, minimalist web framework for Node.js.
*MongoDB: A NoSQL document database.
*Mongoose: An ODM (Object Data Modeling) library for MongoDB and Node.js.
*JSON Web Tokens (JWT): For secure authentication.
*Bcrypt.js: For hashing passwords.
*Multer: A Node.js middleware for handling multipart/form-data, primarily used for file uploads.
*Nodemailer: For sending emails (e.g., registration confirmation).
*Nodemon: A utility that monitors for any changes in your source and automatically restarts your server.

## Project Structure
The repository is organized into two main directories:
student-registration-system/
├── back-end/
│   ├── controllers/         # Handles API logic (student, teacher)
│   ├── middleware/          # Authentication middleware
│   ├── models/              # Mongoose schemas (Student, Teacher)
│   ├── routes/              # API routes (student, teacher)
│   ├── utils/               # Utility functions (sendEmail, upload config)
│   ├── .env                 # Environment variables example
│   ├── package.json
│   └── server.js            # Main backend server file
└── student-registration-frontend/
    ├── public/
    ├── src/
    │   ├── components/      # Reusable UI components
    │   │   └── forms/       # Login/Signup forms
    │   ├── services/        # API service calls (api.js)
    │   ├── styles/          # Global CSS (Tailwind directives)
    │   ├── App.jsx          # Main App component
    │   ├── index.jsx        # React DOM rendering
    │   └── routes.jsx       # Centralized route definitions
    ├── .env                 # Environment variables example
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js

## Usage
1.Access the application: Open your web browser and navigate to http://localhost:5173/.
2.Home Page: You will land on the home page (or a redirect to a login page, depending on your routes.jsx configuration).
3.Student Flow:

*Click "Student Signup" to register a new student account.
*After successful registration, you'll be redirected to the student login page.
*Log in with your student credentials.
*You will be redirected to the Student Profile page, where you can view/update your details and upload a profile picture.

4.Teacher Flow:

*Click "Teacher Signup" to register a new teacher account.
*After successful registration, you'll be redirected to the teacher login page.
*Log in with your teacher credentials.
*You will be redirected to the Teacher Dashboard, where you can view, edit, or delete student records.




