# ZIP Intern Management System - Backend API

This is the backend API for the ZIP Intern Management System, built with Node.js, Express, and MongoDB.

## Features

- **Dashboard Data**: Aggregated statistics for intern progress, skills, and feedback
- **Profile Management**: Complete intern profile CRUD operations
- **Skills Tracking**: Add, update, and track skill progression
- **Portfolio Management**: Project showcase and management
- **Feedback System**: Mentor feedback collection and rating
- **Progress Tracking**: Milestone and goal tracking
- **Achievement System**: Recognition and badges
- **Team Collaboration**: Team project tracking
- **Authentication**: JWT-based authentication
- **Security**: Rate limiting, CORS, and input validation

## API Endpoints

### Dashboard
- `GET /api/interns/:id/dashboard` - Get aggregated dashboard data

### Profile
- `GET /api/interns/:id` - Get intern profile
- `PUT /api/interns/:id` - Update intern profile

### Skills
- `GET /api/interns/:id/skills` - Get all skills
- `POST /api/interns/:id/skills` - Add new skill
- `PUT /api/interns/:id/skills/:skillId` - Update skill

### Portfolio
- `GET /api/interns/:id/portfolio` - Get portfolio projects
- `POST /api/interns/:id/portfolio` - Add new project
- `PUT /api/interns/:id/portfolio/:projectId` - Update project

### Feedback
- `GET /api/interns/:id/feedback` - Get feedback
- `POST /api/interns/:id/feedback` - Add new feedback

### Progress
- `GET /api/interns/:id/progress` - Get progress milestones
- `PUT /api/interns/:id/progress/:milestoneId` - Update milestone

### Achievements
- `GET /api/interns/:id/achievements` - Get achievements

### Team Projects
- `GET /api/interns/:id/team-projects` - Get team projects

### Authentication
- `POST /api/auth/register` - Register new intern
- `POST /api/auth/login` - Login intern

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/zip-interns
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in .env
   ```

5. **Run the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

### Database Setup

The API will automatically create the database and collections when you first make a request. You can also seed the database with sample data:

```javascript
// Example: Create a sample intern
const sampleIntern = {
  name: "John Doe",
  email: "john.doe@zip.com",
  role: "Frontend Developer Intern",
  skills: [
    {
      name: "React.js",
      category: "Technical",
      level: "Advanced",
      completed: true,
      mentorValidated: true
    }
  ],
  progress: [
    {
      title: "React Fundamentals",
      status: "completed",
      progress: 100,
      date: new Date("2024-01-15")
    }
  ],
  feedback: [
    {
      mentor: "Sarah Johnson",
      role: "Senior Frontend Developer",
      rating: 4.5,
      comment: "Excellent work on React components!",
      category: "Technical Skills"
    }
  ]
};
```

## Dashboard Data Structure

The dashboard endpoint returns aggregated data:

```json
{
  "profile": {
    "name": "John Doe",
    "role": "Frontend Developer Intern",
    "avatar": "https://example.com/avatar.jpg"
  },
  "progress": 75,
  "skillsCount": 12,
  "feedbackRating": 4.2
}
```

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for frontend communication
- **Helmet**: Security headers
- **Input Validation**: Request validation middleware
- **JWT Authentication**: Token-based authentication
- **Error Handling**: Comprehensive error responses

## Development

### Project Structure
```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   └── internController.js  # Business logic
├── middleware/
│   └── auth.js             # Authentication middleware
├── models/
│   └── Intern.js           # Mongoose schema
├── routes/
│   ├── authRoutes.js       # Authentication routes
│   └── internRoutes.js     # Intern management routes
├── server.js               # Main server file
├── package.json
└── README.md
```

### Adding New Features

1. **Create Model** (if needed)
2. **Add Controller Methods**
3. **Create Routes**
4. **Update Frontend Service**

### Testing

```bash
npm test
```

## Production Deployment

1. **Environment Variables**
   - Set `NODE_ENV=production`
   - Use production MongoDB URI
   - Set secure JWT secret
   - Configure CORS for production domain

2. **Security**
   - Use HTTPS
   - Set up proper firewall rules
   - Regular security updates
   - Monitor logs

3. **Performance**
   - Enable compression
   - Use CDN for static assets
   - Database indexing
   - Caching strategies

## API Documentation

For detailed API documentation, visit:
- Development: `http://localhost:5000/api/health`
- Production: `https://your-domain.com/api/health`

## Support

For issues and questions:
- Check the logs: `npm run dev`
- Verify MongoDB connection
- Test endpoints with Postman or similar tool
- Check CORS configuration for frontend integration 