const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/database');
const internRoutes = require('./routes/internRoutes');
const authRoutes = require('./routes/authRoutes');
const skillRoutes = require("./routes/skillRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const startServer = async () => {
  try {
    await connectDB();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
};
startServer();

// Security middleware
app.use(helmet());


// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
  ? [process.env.FRONTEND_URL,'https://zimli.netlify.app/'] 
  : ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('combined'));
}



// Body parsing middleware with increased limits for base64 images
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/interns', internRoutes);
app.use('/api/skills', skillRoutes);


app.get("/",(req,res)=>{
  res.send({
    success:true,
    message:"route Working"
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
}); 

// Add this helper function to your utils
const logger = {
  log: (...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(...args);
    }
  },
  error: (...args) => {
    console.error(...args); // Always log errors
  }
}; 