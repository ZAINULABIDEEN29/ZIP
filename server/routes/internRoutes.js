const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
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
} = require('../controllers/internController');

// Public landing page routes (no auth required)
router.get('/landing/all', getAllInternsForLanding);
router.get('/landing/categories', getCategoriesWithCounts);
// Public approval link for Zimlitech project (no auth)
router.get('/approve-project', approveProjectByToken);

// Apply auth middleware to all other routes
router.use(auth);

// Profile routes
router.get('/:id', getInternById);
router.put('/:id', updateProfile);

// Skills routes
router.get('/:id/skills', getSkills);
router.post('/:id/skills', addSkill);
router.put('/:id/skills/:skillId', updateSkill);
router.delete('/:id/skills/:skillId', deleteSkill);

// Portfolio routes
router.get('/:id/portfolio', getPortfolio);
router.post('/:id/portfolio', addProject);
router.put('/:id/portfolio/:projectId', updateProject);
router.delete('/:id/portfolio/:projectId', deleteProject);

// Admin approval routes
router.post('/:id/portfolio/:projectId/approve', approveProject);
router.get('/admin/pending-projects', getPendingProjects);

// Feedback routes
router.get('/:id/feedback', getFeedback);
router.post('/:id/feedback', addFeedback);
router.delete('/:id/feedback/:feedbackId', deleteFeedback);

// Progress routes
router.get('/:id/progress', getProgress);
router.post('/:id/progress', addMilestone);
router.put('/:id/progress/:milestoneId', updateMilestone);
router.delete('/:id/progress/:milestoneId', deleteMilestone);

// Achievements routes
router.get('/:id/achievements', getAchievements);
router.post('/:id/achievements', addAchievement);
router.put('/:id/achievements/:achievementId', updateAchievement);
router.delete('/:id/achievements/:achievementId', deleteAchievement);

// Team projects routes
router.get('/:id/team-projects', getTeamProjects);
router.post('/:id/team-projects', addTeamProject);
router.put('/:id/team-projects/:projectId', updateTeamProject);
router.delete('/:id/team-projects/:projectId', deleteTeamProject);

// Dashboard data (aggregated)
router.get('/:id/dashboard', getDashboardData);

// Social data (achievements + team projects)
router.get('/:id/social', getSocialData);

// Daily Tasks Routes
router.post('/:id/daily-tasks', addDailyTask);
router.get('/:id/daily-tasks', getDailyTasks);
router.put('/:id/daily-tasks/:taskId', updateDailyTask);
router.delete('/:id/daily-tasks/:taskId', deleteDailyTask);
router.get('/:id/daily-tasks-stats', getDailyTaskStats);

module.exports = router; 