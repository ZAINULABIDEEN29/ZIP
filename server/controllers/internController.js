const Intern = require('../models/Intern');
const { sendProjectApprovalEmail } = require('../utils/sendEmail');
const mongoose = require('mongoose');
const crypto = require('crypto');

// Get intern by ID
const getInternById = async (req, res) => {
  try {
    const intern = await Intern.findById(req.params.id).select('-password');
    if (!intern) {
      return res.status(404).json({ error: 'Intern not found' });
    }
    res.json(intern);
  } catch (error) {
    console.error('Get intern error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update intern profile
const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, location, bio, avatar, role, category, education } = req.body;
    const intern = await Intern.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, location, bio, avatar, role, category, education },
      { new: true, runValidators: true }
    ).select('-password');

    if (!intern) {
      return res.status(404).json({ error: 'Intern not found' });
    }

    res.json(intern);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get intern skills
const getSkills = async (req, res) => {
  try {
    const intern = await Intern.findById(req.params.id).select('skills');
    if (!intern) {
      return res.status(404).json({ error: 'Intern not found' });
    }
    res.json(intern.skills);
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update skill
const updateSkill = async (req, res) => {
  try {
    const { skillId } = req.params;
    const updateData = req.body;
    
    const intern = await Intern.findById(req.params.id);
    if (!intern) {
      return res.status(404).json({ error: 'Intern not found' });
    }

    const skillIndex = intern.skills.findIndex(skill => skill._id.toString() === skillId);
    if (skillIndex === -1) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    intern.skills[skillIndex] = { ...intern.skills[skillIndex].toObject(), ...updateData };
    await intern.save();

    res.json(intern.skills[skillIndex]);
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add new skill
const addSkill = async (req, res) => {
  try {
    const intern = await Intern.findById(req.params.id);
    if (!intern) {
      return res.status(404).json({ error: 'Intern not found' });
    }

    intern.skills.push(req.body);
    await intern.save();

    res.json(intern.skills[intern.skills.length - 1]);
  } catch (error) {
    console.error('Add skill error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get portfolio projects
const getPortfolio = async (req, res) => {
  try {
    const intern = await Intern.findById(req.params.id).select('portfolio');
    if (!intern) {
      return res.status(404).json({ error: 'Intern not found' });
    }
    res.json(intern.portfolio);
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add portfolio project
const addProject = async (req, res) => {
  try {
    const intern = await Intern.findById(req.params.id);
    if (!intern) {
      return res.status(404).json({ error: 'Intern not found' });
    }

    // Validate required fields
    if (!req.body.title || !req.body.description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    // Validate image size if present
    if (req.body.image && req.body.image.length > 5 * 1024 * 1024) { // 5MB limit
      return res.status(400).json({ error: 'Image size too large. Please use a smaller image.' });
    }

    // Remove approvalStatus from req.body if present
    const { approvalStatus, ...rest } = req.body;
    const type = rest.type || 'user';
    let approvalToken;
    if (type === 'zimlitech') {
      approvalToken = crypto.randomBytes(24).toString('hex');
      console.log('Generated approval token for Zimlitech project:', approvalToken);
    }
    const projectData = {
      ...rest,
      type,
      approvalStatus: type === 'zimlitech' ? 'pending' : 'approved',
      submittedAt: new Date(),
      approvalToken: type === 'zimlitech' ? approvalToken : undefined
    };


    intern.portfolio.push(projectData);
    await intern.save();

    // Send approval email if needed
    if (type === 'zimlitech') {
      try {
        const newProject = intern.portfolio[intern.portfolio.length - 1];
        console.log('Sending approval email for project with token:', newProject.approvalToken);
        await sendProjectApprovalEmail(intern, newProject);
      } catch (emailError) {
        console.error('Failed to send approval email:', emailError);
        // Don't fail the project creation if email fails
      }
    }

    res.json(intern.portfolio[intern.portfolio.length - 1]);
  } catch (error) {
    console.error('Add project error:', error);
    
    // Provide more specific error messages
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Invalid project data: ' + error.message });
    } else if (error.code === 11000) {
      return res.status(400).json({ error: 'Project with this title already exists' });
    } else {
      return res.status(500).json({ error: 'Server error while adding project' });
    }
  }
};

// Approve Zimlitech project
const approveProject = async (req, res) => {
  try {
    const { id, projectId } = req.params;
    const { action, rejectionReason } = req.body;

    const query = {
      _id: id,
      'portfolio._id': mongoose.Types.ObjectId(projectId),
      'portfolio.type': 'zimlitech'
    };


    let update;
    if (action === 'approve') {
      update = {
        'portfolio.$.approvalStatus': 'approved',
        'portfolio.$.approvedAt': new Date(),
        'portfolio.$.approvedBy': req.user?.email || 'admin',
        'portfolio.$.rejectionReason': undefined
      };
    } else if (action === 'reject') {
      update = {
        'portfolio.$.approvalStatus': 'rejected',
        'portfolio.$.rejectionReason': rejectionReason || 'No reason provided',
        'portfolio.$.approvedAt': new Date(),
        'portfolio.$.approvedBy': req.user?.email || 'admin'
      };
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }

    const intern = await Intern.findOneAndUpdate(
      query,
      { $set: update },
      { new: true }
    );


    if (!intern) {
      return res.status(404).json({ error: 'Intern or project not found' });
    }

    // Find the updated project to return
    const updatedProject = intern.portfolio.find(p => p._id.toString() === projectId);

    res.json({
      message: `Project ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
      project: updatedProject
    });
  } catch (error) {
    console.error('Approve project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get pending Zimlitech projects (for admin)
const getPendingProjects = async (req, res) => {
  try {
    const interns = await Intern.find({
      'portfolio.type': 'zimlitech',
      'portfolio.approvalStatus': 'pending'
    }).select('name email portfolio');

    const pendingProjects = [];
    interns.forEach(intern => {
      intern.portfolio.forEach(project => {
        if (project.type === 'zimlitech' && project.approvalStatus === 'pending') {
          pendingProjects.push({
            ...project.toObject(),
            internName: intern.name,
            internEmail: intern.email,
            internId: intern._id
          });
        }
      });
    });

    res.json(pendingProjects);
  } catch (error) {
    console.error('Get pending projects error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update portfolio project
const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const updateData = req.body;
    
    const intern = await Intern.findById(req.params.id);
    if (!intern) {
      return res.status(404).json({ error: 'Intern not found' });
    }

    const projectIndex = intern.portfolio.findIndex(project => project._id.toString() === projectId);
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    intern.portfolio[projectIndex] = { ...intern.portfolio[projectIndex].toObject(), ...updateData };
    await intern.save();

    res.json(intern.portfolio[projectIndex]);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get feedback
const getFeedback = async (req, res) => {
  try {
    const intern = await Intern.findById(req.params.id).select('feedback');
    if (!intern) {
      return res.status(404).json({ error: 'Intern not found' });
    }
    res.json(intern.feedback);
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add feedback
const addFeedback = async (req, res) => {
  try {
    const intern = await Intern.findById(req.params.id);
    if (!intern) {
      return res.status(404).json({ error: 'Intern not found' });
    }

    intern.feedback.push(req.body);
    await intern.save();

    res.json(intern.feedback[intern.feedback.length - 1]);
  } catch (error) {
    console.error('Add feedback error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get progress timeline
const getProgress = async (req, res) => {
  try {
    const intern = await Intern.findById(req.params.id).select('progress');
    if (!intern) {
      return res.status(404).json({ error: 'Intern not found' });
    }
    res.json(intern.progress);
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update progress milestone
const updateMilestone = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const updateData = req.body;
    
    const intern = await Intern.findById(req.params.id);
    if (!intern) {
      return res.status(404).json({ error: 'Intern not found' });
    }

    const milestoneIndex = intern.progress.findIndex(milestone => milestone._id.toString() === milestoneId);
    if (milestoneIndex === -1) {
      return res.status(404).json({ error: 'Milestone not found' });
    }

    intern.progress[milestoneIndex] = { ...intern.progress[milestoneIndex].toObject(), ...updateData };
    await intern.save();

    res.json(intern.progress[milestoneIndex]);
  } catch (error) {
    console.error('Update milestone error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get achievements
const getAchievements = async (req, res) => {
  try {
    const intern = await Intern.findById(req.params.id).select('achievements');
    if (!intern) {
      return res.status(404).json({ error: 'Intern not found' });
    }
    res.json(intern.achievements);
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get team projects
const getTeamProjects = async (req, res) => {
  try {
    const intern = await Intern.findById(req.params.id).select('teamProjects');
    if (!intern) {
      return res.status(404).json({ error: 'Intern not found' });
    }
    res.json(intern.teamProjects);
  } catch (error) {
    console.error('Get team projects error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get dashboard data (aggregated)
const getDashboardData = async (req, res) => {
  try {
    const intern = await Intern.findById(req.params.id).select('-password');
    if (!intern) {
      return res.status(404).json({ error: 'Intern not found' });
    }
    // Update legacy projects that don't have type field
    let hasUpdated = false;
    intern.portfolio.forEach(project => {
      if (!project.type) {
        project.type = 'user'; // Default to user project
        hasUpdated = true;
      }
    });

    // Save if any updates were made
    if (hasUpdated) {
      await intern.save();
    
    }

    const dashboardData = {
      profile: {
        name: intern.name,
        email: intern.email,
        role: intern.role,
        category: intern.category,
        avatar: intern.avatar || '/images/default-avatar.png',
        phone: intern.phone,
        location: intern.location,
        bio: intern.bio,
        startDate: intern.startDate
      },
      stats: {
        overallProgress: intern.overallProgress,
        skillsCount: intern.skillsCount,
        averageRating: intern.averageRating
      },
      skills: intern.skills,
      portfolio: intern.portfolio,
      feedback: intern.feedback,
      progress: intern.progress,
      achievements: intern.achievements,
      teamProjects: intern.teamProjects
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Get dashboard data error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add progress milestone
const addMilestone = async (req, res) => {
  try {
    const intern = await Intern.findById(req.params.id);
    if (!intern) {
      return res.status(404).json({ error: 'Intern not found' });
    }

    intern.progress.push(req.body);
    await intern.save();

    res.json(intern.progress[intern.progress.length - 1]);
  } catch (error) {
    console.error('Add milestone error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete progress milestone
const deleteMilestone = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    
    const intern = await Intern.findById(req.params.id);
    if (!intern) {
      return res.status(404).json({ error: 'Intern not found' });
    }

    const milestoneIndex = intern.progress.findIndex(milestone => milestone._id.toString() === milestoneId);
    if (milestoneIndex === -1) {
      return res.status(404).json({ error: 'Milestone not found' });
    }

    intern.progress.splice(milestoneIndex, 1);
    await intern.save();

    res.json({ message: 'Milestone deleted successfully' });
  } catch (error) {
    console.error('Delete milestone error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add achievement
const addAchievement = async (req, res) => {
  try {
    const intern = await Intern.findById(req.params.id);
    if (!intern) {
      return res.status(404).json({ error: 'Intern not found' });
    }

    intern.achievements.push(req.body);
    await intern.save();

    res.json(intern.achievements[intern.achievements.length - 1]);
  } catch (error) {
    console.error('Add achievement error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update achievement
const updateAchievement = async (req, res) => {
  try {
    const { achievementId } = req.params;
    const updateData = req.body;
    
    const intern = await Intern.findById(req.params.id);
    if (!intern) {
      return res.status(404).json({ error: 'Intern not found' });
    }

    const achievementIndex = intern.achievements.findIndex(achievement => achievement._id.toString() === achievementId);
    if (achievementIndex === -1) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    intern.achievements[achievementIndex] = { ...intern.achievements[achievementIndex].toObject(), ...updateData };
    await intern.save();

    res.json(intern.achievements[achievementIndex]);
  } catch (error) {
    console.error('Update achievement error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete achievement
const deleteAchievement = async (req, res) => {
  try {
    const { achievementId } = req.params;
    
    const intern = await Intern.findById(req.params.id);
    if (!intern) {
      return res.status(404).json({ error: 'Intern not found' });
    }

    const achievementIndex = intern.achievements.findIndex(achievement => achievement._id.toString() === achievementId);
    if (achievementIndex === -1) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    intern.achievements.splice(achievementIndex, 1);
    await intern.save();

    res.json({ message: 'Achievement deleted successfully' });
  } catch (error) {
    console.error('Delete achievement error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add team project
const addTeamProject = async (req, res) => {
  try {
    const intern = await Intern.findById(req.params.id);
    if (!intern) {
      return res.status(404).json({ error: 'Intern not found' });
    }

    intern.teamProjects.push(req.body);
    await intern.save();

    res.json(intern.teamProjects[intern.teamProjects.length - 1]);
  } catch (error) {
    console.error('Add team project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update team project
const updateTeamProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const updateData = req.body;
    
    const intern = await Intern.findById(req.params.id);
    if (!intern) {
      return res.status(404).json({ error: 'Intern not found' });
    }

    const projectIndex = intern.teamProjects.findIndex(project => project._id.toString() === projectId);
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Team project not found' });
    }

    intern.teamProjects[projectIndex] = { ...intern.teamProjects[projectIndex].toObject(), ...updateData };
    await intern.save();

    res.json(intern.teamProjects[projectIndex]);
  } catch (error) {
    console.error('Update team project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete team project
const deleteTeamProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const intern = await Intern.findById(req.params.id);
    if (!intern) {
      return res.status(404).json({ error: 'Intern not found' });
    }

    const projectIndex = intern.teamProjects.findIndex(project => project._id.toString() === projectId);
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Team project not found' });
    }

    intern.teamProjects.splice(projectIndex, 1);
    await intern.save();

    res.json({ message: 'Team project deleted successfully' });
  } catch (error) {
    console.error('Delete team project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete skill
const deleteSkill = async (req, res) => {
  try {
    const { skillId } = req.params;
    
    const intern = await Intern.findById(req.params.id);
    if (!intern) {
      return res.status(404).json({ error: 'Intern not found' });
    }

    const skillIndex = intern.skills.findIndex(skill => skill._id.toString() === skillId);
    if (skillIndex === -1) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    intern.skills.splice(skillIndex, 1);
    await intern.save();

    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete portfolio project
const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const intern = await Intern.findById(req.params.id);
    if (!intern) {
      return res.status(404).json({ error: 'Intern not found' });
    }

    const projectIndex = intern.portfolio.findIndex(project => project._id.toString() === projectId);
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    intern.portfolio.splice(projectIndex, 1);
    await intern.save();

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete feedback
const deleteFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    
    const intern = await Intern.findById(req.params.id);
    if (!intern) {
      return res.status(404).json({ error: 'Intern not found' });
    }

    const feedbackIndex = intern.feedback.findIndex(feedback => feedback._id.toString() === feedbackId);
    if (feedbackIndex === -1) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    intern.feedback.splice(feedbackIndex, 1);
    await intern.save();

    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get social data (combines achievements and team projects)
const getSocialData = async (req, res) => {
  try {
    const intern = await Intern.findById(req.params.id).select('achievements teamProjects');
    if (!intern) {
      return res.status(404).json({ error: 'Intern not found' });
    }
    
    const socialData = {
      achievements: intern.achievements,
      teamProjects: intern.teamProjects,
      stats: {
        achievementsCount: intern.achievements.length,
        teamProjectsCount: intern.teamProjects.length,
        activeProjects: intern.teamProjects.filter(project => project.status === 'active').length
      }
    };
    
    res.json(socialData);
  } catch (error) {
    console.error('Get social data error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Daily Tasks Controllers
const addDailyTask = async (req, res) => {
  try {
    const { id } = req.params;
  
    const taskData = req.body;

    const intern = await Intern.findById(id);
    
    if (!intern) {
      return res.status(404).json({ message: 'Intern not found' });
    }

    // Add the new task
    intern.dailyTasks.push(taskData);
    await intern.save();

    const newTask = intern.dailyTasks[intern.dailyTasks.length - 1];
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error adding daily task:', error);
    res.status(500).json({ message: 'Error adding daily task', error: error.message });
  }
};

const getDailyTasks = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, startDate, endDate, status, category } = req.query;

    const intern = await Intern.findById(id);
    if (!intern) {
      return res.status(404).json({ message: 'Intern not found' });
    }

    let tasks = intern.dailyTasks;

    // Filter by date if provided
    if (date) {
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      const nextDate = new Date(targetDate);
      nextDate.setDate(nextDate.getDate() + 1);
      
      tasks = tasks.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate >= targetDate && taskDate < nextDate;
      });
    }

    // Filter by date range if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      
      tasks = tasks.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate >= start && taskDate <= end;
      });
    }

    // Filter by status if provided
    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }

    // Filter by category if provided
    if (category) {
      tasks = tasks.filter(task => task.category === category);
    }

    // Sort by date (newest first)
    tasks.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(tasks);
  } catch (error) {
    console.error('Error getting daily tasks:', error);
    res.status(500).json({ message: 'Error getting daily tasks', error: error.message });
  }
};

const updateDailyTask = async (req, res) => {
  try {
    const { id, taskId } = req.params;
    const updateData = req.body;

    const intern = await Intern.findById(id);
    if (!intern) {
      return res.status(404).json({ message: 'Intern not found' });
    }

    const taskIndex = intern.dailyTasks.findIndex(task => task._id.toString() === taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Daily task not found' });
    }

    // Update the task
    intern.dailyTasks[taskIndex] = {
      ...intern.dailyTasks[taskIndex].toObject(),
      ...updateData
    };

    await intern.save();
    res.json(intern.dailyTasks[taskIndex]);
  } catch (error) {
    console.error('Error updating daily task:', error);
    res.status(500).json({ message: 'Error updating daily task', error: error.message });
  }
};

const deleteDailyTask = async (req, res) => {
  try {
    const { id, taskId } = req.params;

    const intern = await Intern.findById(id);
    if (!intern) {
      return res.status(404).json({ message: 'Intern not found' });
    }

    const taskIndex = intern.dailyTasks.findIndex(task => task._id.toString() === taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Daily task not found' });
    }

    intern.dailyTasks.splice(taskIndex, 1);
    await intern.save();

    res.json({ message: 'Daily task deleted successfully' });
  } catch (error) {
    console.error('Error deleting daily task:', error);
    res.status(500).json({ message: 'Error deleting daily task', error: error.message });
  }
};

const getDailyTaskStats = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    const intern = await Intern.findById(id);
    if (!intern) {
      return res.status(404).json({ message: 'Intern not found' });
    }

    let tasks = intern.dailyTasks;

    // Filter by date range if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      
      tasks = tasks.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate >= start && taskDate <= end;
      });
    }

    // Calculate stats
    const stats = {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(task => task.status === 'completed').length,
      pendingTasks: tasks.filter(task => task.status === 'pending').length,
      inProgressTasks: tasks.filter(task => task.status === 'in-progress').length,
      blockedTasks: tasks.filter(task => task.status === 'blocked').length,
      totalTimeSpent: tasks.reduce((total, task) => {
        return total + (task.timeSpent?.hours || 0) + (task.timeSpent?.minutes || 0) / 60;
      }, 0),
      categoryBreakdown: {},
      priorityBreakdown: {}
    };

    // Category breakdown
    tasks.forEach(task => {
      stats.categoryBreakdown[task.category] = (stats.categoryBreakdown[task.category] || 0) + 1;
    });

    // Priority breakdown
    tasks.forEach(task => {
      stats.priorityBreakdown[task.priority] = (stats.priorityBreakdown[task.priority] || 0) + 1;
    });

    res.json(stats);
  } catch (error) {
    console.error('Error getting daily task stats:', error);
    res.status(500).json({ message: 'Error getting daily task stats', error: error.message });
  }
};

// Get all interns for landing page (public data only)
const getAllInternsForLanding = async (req, res) => {
  try {
    const { category } = req.query;
    
    let query = { role: { $nin: ['Admin', 'Mentor'] } };
    if (category && category !== 'all') {
      query.category = category;
    }

    const interns = await Intern.find(query)
      .select('name role category avatar location email phone github overallProgress skills portfolio achievements bio education experience')
      .lean();

    // Transform the data to match the frontend structure
    const transformedInterns = interns.map(intern => ({
      id: intern._id,
      name: intern.name,
      role: intern.role,
      avatar: intern.avatar || '/images/default-avatar.png',
      location: intern.location || 'Location not specified',
      email: intern.email,
      phone: intern.phone || '+1 (555) 000-0000',
      github: intern.github || 'https://github.com',
      progress: intern.overallProgress || 0,
      experience: intern.experience || '1 year',
      education: intern.education || 'Computer Science',
      skills: intern.skills.map(skill => skill.name).slice(0, 7),
      achievements: intern.achievements.map(achievement => achievement.title).slice(0, 3),
      portfolio: intern.portfolio.map(project => ({
        id: project._id,
        title: project.title,
        description: project.description || 'Project description',
        image: project.image || '/images/default-project.png',
        technologies: project.technologies || ['React', 'Node.js'],
        liveUrl: project.liveUrl || 'https://example.com',
        githubUrl: project.githubUrl || 'https://github.com',
        completionDate: project.completedDate || new Date().toISOString().split('T')[0]
      })).slice(0, 2),
      category: intern.category,
      bio: intern.bio || 'Passionate developer with expertise in modern technologies.'
    }));

    res.json(transformedInterns);
  } catch (error) {
    console.error('Get all interns error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get categories with counts for landing page
const getCategoriesWithCounts = async (req, res) => {
  try {
    const categories = [
      { id: 'all', name: 'All Interns' },
      { id: 'frontend', name: 'Frontend' },
      { id: 'backend', name: 'Backend' },
      { id: 'fullstack', name: 'Full Stack' },
      { id: 'aiml', name: 'AI/ML' },
      { id: 'mobile', name: 'Mobile' },
      { id: 'sqa', name: 'SQA' }
    ];

    const counts = await Promise.all(
      categories.map(async (category) => {
        if (category.id === 'all') {
          const count = await Intern.countDocuments();
          return { ...category, count };
        } else {
          const count = await Intern.countDocuments({ category: category.id });
          return { ...category, count };
        }
      })
    );

    res.json(counts);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Clean up approval token after successful approval
const cleanupApprovalToken = async (internId, projectId) => {
  try {
    const intern = await Intern.findById(internId);
    if (!intern) {
    
      return;
    }

    const projectIndex = intern.portfolio.findIndex(p => p._id.toString() === projectId);
    if (projectIndex !== -1) {
      intern.portfolio[projectIndex].approvalToken = undefined;
      await intern.save();
     
    }
  } catch (error) {
    console.error('Error cleaning up approval token:', error);
  }
};

// Approve Zimlitech project by token (for email link)
const approveProjectByToken = async (req, res) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({ error: 'Invalid or missing approval token.' });
    }

    // Find the intern and project with this approval token
    const intern = await Intern.findOne({ 'portfolio.approvalToken': token });
    
    if (!intern) {
      return res.status(404).json({ error: 'Invalid or expired approval token.' });
    }

    // Find the project index
    const projectIndex = intern.portfolio.findIndex(
      (project) => project.approvalToken === token
    );

    
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found for this token.' });
    }

    // Check if project is already approved
    const project = intern.portfolio[projectIndex];
    
    if (project.approvalStatus === 'approved') {
      return res.json({ 
        success: true,
        message: 'Project was already approved.',
        project: project
      });
    }

    // Approve the project
    intern.portfolio[projectIndex].approvalStatus = 'approved';
    intern.portfolio[projectIndex].approvedAt = new Date();
    intern.portfolio[projectIndex].approvedBy = 'admin-email-link';
    
    await intern.save();
   

    // Clean up the token after successful approval
    setTimeout(() => {
      cleanupApprovalToken(intern._id, project._id);
    }, 1000);

    return res.json({ 
      success: true,
      message: 'Project approved successfully!',
      project: intern.portfolio[projectIndex]
    });
  } catch (error) {
    console.error('Approve project by token error:', error);
    return res.status(500).json({ error: 'Server error while approving project.' });
  }
};

module.exports = {
  getInternById,
  updateProfile,
  getSkills,
  updateSkill,
  addSkill,
  deleteSkill,
  getPortfolio,
  addProject,
  updateProject,
  deleteProject,
  approveProject,
  getPendingProjects,
  getFeedback,
  addFeedback,
  deleteFeedback,
  getProgress,
  addMilestone,
  updateMilestone,
  deleteMilestone,
  getAchievements,
  addAchievement,
  updateAchievement,
  deleteAchievement,
  getTeamProjects,
  addTeamProject,
  updateTeamProject,
  deleteTeamProject,
  getDashboardData,
  getSocialData,
  addDailyTask,
  getDailyTasks,
  updateDailyTask,
  deleteDailyTask,
  getDailyTaskStats,
  getAllInternsForLanding,
  getCategoriesWithCounts,
  approveProjectByToken
}; 