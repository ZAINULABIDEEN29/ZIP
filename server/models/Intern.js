const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const internSchema = new mongoose.Schema({
  // Profile Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
   
  },
  isApproved:{
    type: Boolean,
    default: false
  },
  approvalToken:{
    type: String,
  },
  role: {
    type: String,
    required: true,
    enum: [
      'Intern',
      'Backend Developer',
      'Frontend Developer',
      'Full Stack Developer',
      'Mobile Developer',
      'AI/ML Engineer',
      'SQA Engineer',
      'DevOps Engineer',
      'UI/UX Designer',
      'Data Scientist',
      'Admin'
    ],
    default: 'Intern'
  },
  category: {
    type: String,
    enum: ['frontend', 'backend', 'fullstack', 'aiml', 'mobile', 'sqa'],
    default: 'fullstack',
    
  },
  avatar: {
    type: String,
    default: null
  },
  phone: String,
  location: String,
  startDate: {
    type: Date,
    default: Date.now
  },
  bio: String,
  education: String,

  // Skills
  skills: [{
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['Technical', 'Soft Skills', 'Tools'],
      default: 'Technical'
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    completed: {
      type: Boolean,
      default: false
    },
    mentorValidated: {
      type: Boolean,
      default: false
    },
    approved: {
      type: Boolean,
      default: false
    }
  }],

  // Portfolio Projects
  portfolio: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    technologies: [String],
    githubUrl: String,
    liveUrl: String,
    image: String,
    completedDate: Date,
    featured: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      enum: ['user', 'zimlitech'],
      default: 'user'
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    approvalToken: String,
    submittedAt: {
      type: Date,
      default: Date.now
    },
    approvedAt: Date,
    approvedBy: String,
    rejectionReason: String
  }],

  // Feedback
  feedback: [{
    mentor: {
      type: String,
      required: true
    },
    role: String,
    avatar: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['Technical Skills', 'Design Skills', 'Soft Skills', 'Communication', 'Leadership'],
      default: 'Technical Skills'
    },
    suggestions: [String],
    date: {
      type: Date,
      default: Date.now
    }
  }],

  // Progress Milestones
  progress: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    category: {
      type: String,
      enum: ['Technical', 'Project', 'Soft Skills', 'Presentation'],
      default: 'Technical'
    },
    status: {
      type: String,
      enum: ['completed', 'in-progress', 'upcoming'],
      default: 'upcoming'
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    date: {
      type: Date,
      required: true
    },
    completedDate: Date
  }],

  // Achievements
  achievements: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    badge: {
      type: String,
      enum: ['Course Completion', 'Milestone', 'Excellence', 'Leadership', 'Innovation'],
      default: 'Milestone'
    },
    date: {
      type: Date,
      default: Date.now
    },
    icon: String
  }],

  // Team Projects
  teamProjects: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    role: String,
    technologies: [String],
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ['active', 'completed', 'on-hold'],
      default: 'active'
    },
    teamMembers: [String],
    contribution: String
  }],

  // Daily Tasks
  dailyTasks: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    category: {
      type: String,
      enum: ['Development', 'Learning', 'Meeting', 'Planning', 'Research', 'Testing', 'Documentation', 'Other'],
      default: 'Development'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'blocked'],
      default: 'pending'
    },
    outcomes: [String],
    timeSpent: {
      hours: {
        type: Number,
        min: 0,
        default: 0
      },
      minutes: {
        type: Number,
        min: 0,
        max: 59,
        default: 0
      }
    },
    startTime: Date,
    endTime: Date,
    challenges: [String],
    learnings: [String],
    attachments: [String], // URLs or file paths
    tags: [String],
    date: {
      type: Date,
      default: Date.now
    },
    completedAt: Date,
    notes: String
  }],

  // Dashboard Stats (calculated fields)
  overallProgress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  skillsCount: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },

}, {
  timestamps: true
});

// Calculate dashboard stats before saving
internSchema.pre('save', function(next) {
  // Calculate skills count
  this.skillsCount = this.skills.length;
  
  // Calculate average feedback rating
  if (this.feedback.length > 0) {
    const totalRating = this.feedback.reduce((sum, item) => sum + item.rating, 0);
    this.averageRating = Math.round((totalRating / this.feedback.length) * 10) / 10;
  }
  
  // Calculate overall progress based on completed milestones
  if (this.progress.length > 0) {
    const completedMilestones = this.progress.filter(m => m.status === 'completed').length;
    this.overallProgress = Math.round((completedMilestones / this.progress.length) * 100);
  }
  
  next();
});

// Password hashing
internSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Password comparison method
internSchema.methods.comparePassword = function(candidatePassword) {
  
  
  if (!candidatePassword) {
    return false;
  }
  
  if (!this.password) {
    return false;
  }
  
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Intern', internSchema); 