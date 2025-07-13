# ZIP Project - Code Index

## Project Overview
A full-stack internship management platform with React frontend and Node.js/Express backend.

## Project Structure

### 📁 Root Directory
```
ZIP/
├── client/          # React Frontend Application
└── server/          # Node.js/Express Backend API
```

---

## 🎨 Frontend (client/)

### Core Application Files
- **`index.html`** - Main HTML entry point
- **`main.jsx`** - React application entry point
- **`App.jsx`** - Main application component with routing
- **`App.css`** - Global application styles
- **`index.css`** - Base CSS styles

### Configuration Files
- **`package.json`** - Frontend dependencies and scripts
- **`vite.config.js`** - Vite build configuration
- **`tailwind.config.js`** - Tailwind CSS configuration
- **`postcss.config.js`** - PostCSS configuration
- **`eslint.config.js`** - ESLint configuration
- **`netlify.toml`** - Netlify deployment configuration
- **`vercel.json`** - Vercel deployment configuration

### 📁 Authentication (`src/Auth/`)
- **`User_login.jsx`** - User login component
- **`User_signUp.jsx`** - User registration component
- **`ForgotPassword.jsx`** - Password recovery component
- **`ResetPassword.jsx`** - Password reset component
- **`ApproveIntern.jsx`** - Intern approval component

### 📁 Components (`src/components/`)
- **`Navbar.jsx`** - Navigation bar component
- **`Footer.jsx`** - Footer component
- **`Modal.jsx`** - Reusable modal component
- **`LoginModal.jsx`** - Login modal component
- **`ProtectedRoute.jsx`** - Route protection component
- **`AvatarUploader.jsx`** - Profile picture upload component
- **`Dropdown.jsx`** - Dropdown menu component
- **`Toast.jsx`** - Notification toast component
- **`ProgressBar.jsx`** - Progress indicator component
- **`StarRating.jsx`** - Star rating component
- **`SkillLevelTag.jsx`** - Skill level display component
- **`AchievementBadge.jsx`** - Achievement badge component
- **`TimelineCard.jsx`** - Timeline display component
- **`PortfolioItemCard.jsx`** - Portfolio item display
- **`MentorFeedbackCard.jsx`** - Mentor feedback display

### 📁 Context (`src/context/`)
- **`AuthContext.jsx`** - Authentication state management
- **`InternContext.jsx`** - Intern data state management

### 📁 Layouts (`src/layouts/`)
- **`DashboardLayout.jsx`** - Dashboard layout wrapper

### 📁 Pages (`src/pages/`)
- **`LandingPage.jsx`** - Homepage/landing page
- **`Dashboard.jsx`** - Main dashboard page
- **`Profile.jsx`** - User profile page
- **`Skills.jsx`** - Skills management page
- **`Portfolio.jsx`** - Portfolio display page
- **`Progress.jsx`** - Progress tracking page
- **`Feedback.jsx`** - Feedback management page
- **`Social.jsx`** - Social features page
- **`DailyTasks.jsx`** - Daily tasks management
- **`ApproveProject.jsx`** - Project approval page
- **`ApproveSkill.jsx`** - Skill approval page

### 📁 Services (`src/services/`)
- **`internService.js`** - API calls for intern-related operations
- **`landingService.js`** - API calls for landing page data

### 📁 Utils (`src/utils/`)
- **`helpers.js`** - Utility functions

### 📁 Public Assets (`public/`)
- **`vite.svg`** - Vite logo
- **`zimlitech_logo.png`** - Company logo

---

## ⚙️ Backend (server/)

### Core Server Files
- **`server.js`** - Main Express server entry point
- **`package.json`** - Backend dependencies and scripts
- **`vercel.json`** - Vercel deployment configuration

### 📁 Configuration (`config/`)
- **`database.js`** - MongoDB connection configuration

### 📁 Controllers (`controllers/`)
- **`authController.js`** - Authentication logic (login, register, password reset)
- **`internController.js`** - Intern management logic (CRUD operations)
- **`skillController.js`** - Skills management logic

### 📁 Middleware (`middleware/`)
- **`auth.js`** - Authentication middleware for route protection

### 📁 Models (`models/`)
- **`Intern.js`** - Intern data model/schema
- **`PendingSkills.model.js`** - Pending skills approval model

### 📁 Routes (`routes/`)
- **`authRoutes.js`** - Authentication endpoints
- **`internRoutes.js`** - Intern management endpoints
- **`skillRoutes.js`** - Skills management endpoints

### 📁 Utils (`utils/`)
- **`sendEmail.js`** - Email sending functionality

---

## 🔧 Key Features

### Authentication System
- User registration and login
- Password recovery and reset
- JWT-based authentication
- Protected routes

### Intern Management
- Intern profiles and portfolios
- Skills tracking and approval
- Progress monitoring
- Daily tasks management

### Dashboard Features
- Progress visualization
- Achievement badges
- Mentor feedback system
- Social features

### Admin Features
- Intern approval system
- Project approval
- Skill approval
- User management

---

## 🚀 Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **React Router** - Client-side routing
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Nodemailer** - Email functionality

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logging
- **Rate Limiting** - API protection

---

## 📋 API Endpoints

### Authentication (`/api/auth`)
- POST `/register` - User registration
- POST `/login` - User login
- POST `/forgot-password` - Password recovery
- POST `/reset-password` - Password reset

### Interns (`/api/interns`)
- GET `/` - Get all interns
- POST `/` - Create new intern
- PUT `/:id` - Update intern
- DELETE `/:id` - Delete intern
- GET `/profile` - Get intern profile

### Skills (`/api/skills`)
- GET `/` - Get all skills
- POST `/` - Create new skill
- PUT `/:id` - Update skill
- DELETE `/:id` - Delete skill
- POST `/approve` - Approve skill

---

## 🔒 Security Features
- CORS configuration
- Helmet security headers
- Rate limiting
- Input validation
- JWT token authentication
- Protected API routes

---

## 📦 Deployment
- **Frontend**: Deployed on Vercel/Netlify
- **Backend**: Deployed on Vercel
- **Database**: MongoDB Atlas

---

## 📝 Development Notes
- Uses environment variables for configuration
- Implements proper error handling
- Follows RESTful API conventions
- Responsive design with Tailwind CSS
- Modular component architecture 