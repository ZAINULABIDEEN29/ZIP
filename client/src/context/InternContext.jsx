import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { showToast } from '../components/Toast';
import internService, {
  getDailyTasks,
  addDailyTask,
  updateDailyTask,
  deleteDailyTask,
  getDailyTaskStats
} from '../services/internService';
import { useAuth } from './AuthContext';

const BACKEND_URL= import.meta.env.VITE_API_URL;

const InternContext = createContext();

const initialState = {
  profile: null,
  skills: [],
  portfolio: [],
  feedback: {
    'Technical Skills': [],
    'Design Skills': [],
    'Soft Skills': [],
    'Communication': [],
    'Leadership': []
  },
  progress: [],
  achievements: [],
  teamProjects: [],
  dailyTasks: [],
  dailyTaskStats: null,
  // Dashboard specific fields
  overallProgress: 0,
  skillsCount: 0,
  averageRating: 0,
  loading: false,
  error: null
};

const internReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };
    
    case 'UPDATE_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.payload } };
    
    case 'SET_SKILLS':
      return { ...state, skills: action.payload };
    
    case 'ADD_SKILL':
      return { ...state, skills: [...state.skills, action.payload] };
    
    case 'UPDATE_SKILL':
      return {
        ...state,
        skills: state.skills.map(skill =>
          skill._id === action.payload._id ? { ...skill, ...action.payload } : skill
        )
      };
    
    case 'DELETE_SKILL':
      const updatedSkills = state.skills.filter(skill => skill._id !== action.payload);
      return {
        ...state,
        skills: updatedSkills
      };
    
    case 'SET_PORTFOLIO':
      return { ...state, portfolio: action.payload };
    
    case 'ADD_PROJECT':
      return { ...state, portfolio: [...state.portfolio, action.payload] };
    
    case 'UPDATE_PROJECT':
      return {
        ...state,
        portfolio: state.portfolio.map(project =>
          project._id === action.payload._id ? { ...project, ...action.payload } : project
        )
      };
    
    case 'SET_FEEDBACK':
      // Handle different feedback data structures from backend
      let feedbackData = action.payload;
      
      // Handle null/undefined feedback data
      if (!feedbackData) {
        feedbackData = {};
      }
      
      // If feedback is an array, convert it to the expected structure
      if (Array.isArray(feedbackData)) {
        feedbackData = {
          'Technical Skills': feedbackData.filter(f => f.category === 'Technical Skills' || f.type === 'Technical Skills'),
          'Design Skills': feedbackData.filter(f => f.category === 'Design Skills' || f.type === 'Design Skills'),
          'Soft Skills': feedbackData.filter(f => f.category === 'Soft Skills' || f.type === 'Soft Skills'),
          'Communication': feedbackData.filter(f => f.category === 'Communication' || f.type === 'Communication'),
          'Leadership': feedbackData.filter(f => f.category === 'Leadership' || f.type === 'Leadership')
        };
      }
      
      // Ensure all categories exist as arrays
      const defaultFeedback = {
        'Technical Skills': [],
        'Design Skills': [],
        'Soft Skills': [],
        'Communication': [],
        'Leadership': []
      };
      
      // Ensure each category in feedbackData is an array
      Object.keys(feedbackData).forEach(key => {
        if (!Array.isArray(feedbackData[key])) {
          feedbackData[key] = [];
        }
      });
      
      return { 
        ...state, 
        feedback: {
          ...defaultFeedback,
          ...feedbackData
        }
      };
    
    case 'ADD_FEEDBACK':
      const { category, feedback } = action.payload;
      return {
        ...state,
        feedback: {
          ...state.feedback,
          [category]: [...(state.feedback[category] || []), feedback]
        }
      };
    
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    
    case 'UPDATE_MILESTONE':
      return {
        ...state,
        progress: state.progress.map(milestone =>
          milestone._id === action.payload._id ? { ...milestone, ...action.payload } : milestone
        )
      };
    
    case 'SET_ACHIEVEMENTS':
      return { ...state, achievements: action.payload };
    
    case 'SET_TEAM_PROJECTS':
      return { ...state, teamProjects: action.payload };
    
    case 'SET_DASHBOARD_DATA':
      return { 
        ...state, 
        overallProgress: action.payload.progress,
        skillsCount: action.payload.skillsCount,
        averageRating: action.payload.feedbackRating
      };
    
    case 'CLEAR_DATA':
      return initialState;
    
    case 'ADD_MILESTONE':
      return { ...state, progress: [...state.progress, action.payload] };
    
    case 'DELETE_MILESTONE':
      return {
        ...state,
        progress: state.progress.filter(milestone => milestone._id !== action.payload)
      };
    
    case 'ADD_ACHIEVEMENT':
      return { ...state, achievements: [...state.achievements, action.payload] };
    
    case 'UPDATE_ACHIEVEMENT':
      return {
        ...state,
        achievements: state.achievements.map(achievement =>
          achievement._id === action.payload._id ? { ...achievement, ...action.payload } : achievement
        )
      };
    
    case 'DELETE_ACHIEVEMENT':
      return {
        ...state,
        achievements: state.achievements.filter(achievement => achievement._id !== action.payload)
      };
    
    case 'ADD_TEAM_PROJECT':
      return { ...state, teamProjects: [...state.teamProjects, action.payload] };
    
    case 'UPDATE_TEAM_PROJECT':
      return {
        ...state,
        teamProjects: state.teamProjects.map(project =>
          project._id === action.payload._id ? { ...project, ...action.payload } : project
        )
      };
    
    case 'DELETE_TEAM_PROJECT':
      return {
        ...state,
        teamProjects: state.teamProjects.filter(project => project._id !== action.payload)
      };
    
    case 'DELETE_PROJECT':
      
      const filteredPortfolio = state.portfolio.filter(project => project._id !== action.payload);
      
      return {
        ...state,
        portfolio: filteredPortfolio
      };
    
    case 'DELETE_FEEDBACK':
      return {
        ...state,
        feedback: {
          ...state.feedback,
          'Technical Skills': (state.feedback['Technical Skills'] || []).filter(f => f._id !== action.payload),
          'Design Skills': (state.feedback['Design Skills'] || []).filter(f => f._id !== action.payload),
          'Soft Skills': (state.feedback['Soft Skills'] || []).filter(f => f._id !== action.payload),
          'Communication': (state.feedback['Communication'] || []).filter(f => f._id !== action.payload),
          'Leadership': (state.feedback['Leadership'] || []).filter(f => f._id !== action.payload)
        }
      };
    
    case 'SET_DAILY_TASKS':
      return { ...state, dailyTasks: action.payload };
    
    case 'ADD_DAILY_TASK':
      return { ...state, dailyTasks: [...state.dailyTasks, action.payload] };
    
    case 'UPDATE_DAILY_TASK':
      return {
        ...state,
        dailyTasks: state.dailyTasks.map(task =>
          task._id === action.payload._id ? { ...task, ...action.payload } : task
        )
      };
    
    case 'DELETE_DAILY_TASK':
      return {
        ...state,
        dailyTasks: state.dailyTasks.filter(task => task._id !== action.payload)
      };
    
    case 'SET_DAILY_TASK_STATS':
      return { ...state, dailyTaskStats: action.payload };
    
    default:
      return state;
  }
};

export const InternProvider = ({ children }) => {
  const [state, dispatch] = useReducer(internReducer, initialState);
  const { isAuthenticated, user, token, updateUser } = useAuth();

  // Load intern data when authentication changes
  useEffect(() => {
    if (isAuthenticated && user && token) {
      
      // Load data immediately and also with a delay as backup
      loadInternData();
      
      // Add a backup delay to ensure data loads even if first attempt fails
      const timer = setTimeout(() => {
        // Only reload if we don't have profile data yet
        if (!state.profile) {
          loadInternData();
        }
      }, 500);
      
      return () => clearTimeout(timer);
    } else if (!isAuthenticated) {
      dispatch({ type: 'CLEAR_DATA' });
    }
  }, [isAuthenticated, user, token]);

  // Recalculate dashboard stats based on current state
  const recalculateDashboardStats = () => {
    const { skills, feedback, progress } = state;
    
    const skillsCount = skills?.length || 0;
    const averageRating = feedback && Object.values(feedback).flat().length > 0 
      ? Object.values(feedback).flat().reduce((sum, f) => sum + (f.rating || 0), 0) / Object.values(feedback).flat().length 
      : 0;
    
    // Calculate overall progress based on completed milestones vs total milestones
    const overallProgress = progress?.length > 0 
      ? Math.round((progress.filter(m => m.status === 'completed').length / progress.length) * 100)
      : 0;


    dispatch({ 
      type: 'SET_DASHBOARD_DATA', 
      payload: {
        progress: overallProgress,
        skillsCount,
        feedbackRating: averageRating
      }
    });
  };

  const loadInternData = async (retryCount = 0) => {
    if (!isAuthenticated || !user || !user._id) {
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const internId = user?._id;
      const dashboardData = await internService.getDashboardData(internId);
      
      if (dashboardData) {
        // Only set profile if it doesn't exist or if this is the initial load
        if (dashboardData.profile && !state.profile) {
          dispatch({ type: 'SET_PROFILE', payload: dashboardData.profile });
        }
        if (dashboardData.skills) dispatch({ type: 'SET_SKILLS', payload: dashboardData.skills });
        if (dashboardData.portfolio) dispatch({ type: 'SET_PORTFOLIO', payload: dashboardData.portfolio });
        if (dashboardData.feedback) dispatch({ type: 'SET_FEEDBACK', payload: dashboardData.feedback });
        if (dashboardData.progress) dispatch({ type: 'SET_PROGRESS', payload: dashboardData.progress });
        if (dashboardData.achievements) dispatch({ type: 'SET_ACHIEVEMENTS', payload: dashboardData.achievements });
        if (dashboardData.teamProjects) dispatch({ type: 'SET_TEAM_PROJECTS', payload: dashboardData.teamProjects });
        
        if (dashboardData.stats) {
          dispatch({ 
            type: 'SET_DASHBOARD_DATA', 
            payload: {
              progress: dashboardData.stats.overallProgress,
              skillsCount: dashboardData.stats.skillsCount,
              feedbackRating: dashboardData.stats.averageRating
            }
          });
        }
        
      }
    } catch (error) {

      
      // Retry up to 3 times with increasing delays
      if (retryCount < 3) {
      
        setTimeout(() => {
          loadInternData(retryCount + 1);
        }, (retryCount + 1) * 1000);
        return;
      }
      
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getDashboardData = async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      const internId = user?._id || '1';
      const dashboardData = await internService.getDashboardData(internId);
      dispatch({ type: 'SET_DASHBOARD_DATA', payload: dashboardData });
    } catch (error) {
      showToast('Failed to load dashboard data', 'error');
      throw error;
    }
  };

  const updateProfile = async (profileData) => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated');
    }

    try {
      const internId = user?._id || '1';
      const updatedProfile = await internService.updateProfile(internId, profileData);
      
      // Update both contexts immediately
      dispatch({ type: 'UPDATE_PROFILE', payload: updatedProfile });
      updateUser(updatedProfile);
      
      showToast('Profile updated successfully');
      
      // Don't reload all data - just update the profile in state
      // The useEffect will handle reloading if needed
    } catch (error) {
      showToast('Failed to update profile', 'error');
      throw error;
    }
  };

  const addSkill = async (skillData) => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated');
    }

    try {
      const internId = user?._id || '1';
      const newSkill = await internService.addSkill(internId, skillData);
      dispatch({ type: 'ADD_SKILL', payload: newSkill });
      
      // Recalculate dashboard stats after adding skill
      setTimeout(() => recalculateDashboardStats(), 100);
      
      showToast('Skill added successfully');
    } catch (error) {
      showToast('Failed to add skill', 'error');
      throw error;
    }
  };

  const updateSkill = async (skillId, skillData) => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated');
    }

    try {
      const internId = user?._id || '1';
      const updatedSkill = await internService.updateSkill(internId, skillId, skillData);
      dispatch({ type: 'UPDATE_SKILL', payload: updatedSkill });
      showToast('Skill updated successfully');
    } catch (error) {
      showToast('Failed to update skill', 'error');
      throw error;
    }
  };

  const addProject = async (projectData) => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated');
    }

    try {
      const internId = user?._id || '1';
      const newProject = await internService.addProject(internId, projectData);
      
      // Refresh portfolio data from server to ensure consistency
      const dashboardData = await internService.getDashboardData(internId);
      if (dashboardData && dashboardData.portfolio) {
        dispatch({ type: 'SET_PORTFOLIO', payload: dashboardData.portfolio });
      } else {
        // Fallback to local state update if dashboard data is not available
      dispatch({ type: 'ADD_PROJECT', payload: newProject });
      }
      
      showToast('Project added successfully');
    } catch (error) {
      showToast('Failed to add project', 'error');
      throw error;
    }
  };

  const addFeedback = async (category, feedbackData) => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated');
    }

    try {
      const internId = user?._id || '1';
      const newFeedback = await internService.addFeedback(internId, feedbackData);
      dispatch({ type: 'ADD_FEEDBACK', payload: { category, feedback: newFeedback } });
      
      // Recalculate dashboard stats after adding feedback
      setTimeout(() => recalculateDashboardStats(), 100);
      
      showToast('Feedback added successfully');
    } catch (error) {
      showToast('Failed to add feedback', 'error');
      throw error;
    }
  };

  const addMilestone = async (milestoneData) => {
    if (!isAuthenticated || !user || !user._id) {
      showToast('User not authenticated or missing ID', 'error');
      return false;
    }

    try {
      const newMilestone = await internService.addMilestone(user._id, milestoneData);
      dispatch({ type: 'ADD_MILESTONE', payload: newMilestone });
      
      // Recalculate dashboard stats after adding milestone
      setTimeout(() => recalculateDashboardStats(), 100);
      
      showToast('Milestone added successfully!', 'success');
      return true;
    } catch (error) {
      showToast('Failed to add milestone', 'error');
      throw error;
    }
  };

  const deleteMilestone = async (milestoneId) => {
    if (!isAuthenticated || !user || !user._id) {
      showToast('User not authenticated or missing ID', 'error');
      return false;
    }

    try {
      await internService.deleteMilestone(user._id, milestoneId);
      dispatch({ type: 'DELETE_MILESTONE', payload: milestoneId });
      
      // Recalculate dashboard stats after deleting milestone
      setTimeout(() => recalculateDashboardStats(), 100);
      
      showToast('Milestone deleted successfully!', 'success');
      return true;
    } catch (error) {
      showToast('Failed to delete milestone', 'error');
      throw error;
    }
  };

  const updateMilestone = async (milestoneId, milestoneData) => {
    if (!isAuthenticated || !user || !user._id) {
      showToast('User not authenticated or missing ID', 'error');
      return false;
    }

    try {
      const updatedMilestone = await internService.updateMilestone(user._id, milestoneId, milestoneData);
      dispatch({ type: 'UPDATE_MILESTONE', payload: updatedMilestone });
      
      // Recalculate dashboard stats after updating milestone
      setTimeout(() => recalculateDashboardStats(), 100);
      
      showToast('Milestone updated successfully!', 'success');
      return true;
    } catch (error) {
      showToast('Failed to update milestone', 'error');
      throw error;
    }
  };

  const addAchievement = async (achievementData) => {
    if (!isAuthenticated || !user || !user._id) {
      showToast('User not authenticated or missing ID', 'error');
      return false;
    }

    try {
      const newAchievement = await internService.addAchievement(user._id, achievementData);
      dispatch({ type: 'ADD_ACHIEVEMENT', payload: newAchievement });
      showToast('Achievement added successfully!', 'success');
      return true;
    } catch (error) {
      console.error('Error adding achievement:', error);
      showToast('Failed to add achievement', 'error');
      throw error;
    }
  };

  const updateAchievement = async (achievementId, achievementData) => {
    if (!isAuthenticated || !user || !user._id) {
      showToast('User not authenticated or missing ID', 'error');
      return false;
    }

    try {
      const updatedAchievement = await internService.updateAchievement(user._id, achievementId, achievementData);
      dispatch({ type: 'UPDATE_ACHIEVEMENT', payload: updatedAchievement });
      showToast('Achievement updated successfully!', 'success');
      return true;
    } catch (error) {
      console.error('Error updating achievement:', error);
      showToast('Failed to update achievement', 'error');
      throw error;
    }
  };

  const deleteAchievement = async (achievementId) => {
    if (!isAuthenticated || !user || !user._id) {
      showToast('User not authenticated or missing ID', 'error');
      return false;
    }

    try {
      await internService.deleteAchievement(user._id, achievementId);
      dispatch({ type: 'DELETE_ACHIEVEMENT', payload: achievementId });
      showToast('Achievement deleted successfully!', 'success');
      return true;
    } catch (error) {
      console.error('Error deleting achievement:', error);
      showToast('Failed to delete achievement', 'error');
      throw error;
    }
  };

  const addTeamProject = async (projectData) => {
    if (!isAuthenticated || !user || !user._id) {
      showToast('User not authenticated or missing ID', 'error');
      return false;
    }

    try {
      const newProject = await internService.addTeamProject(user._id, projectData);
      dispatch({ type: 'ADD_TEAM_PROJECT', payload: newProject });
      showToast('Team project added successfully!', 'success');
      return true;
    } catch (error) {
      console.error('Error adding team project:', error);
      showToast('Failed to add team project', 'error');
      throw error;
    }
  };

  const updateTeamProject = async (projectId, projectData) => {
    if (!isAuthenticated || !user || !user._id) {
      showToast('User not authenticated or missing ID', 'error');
      return false;
    }

    try {
      const updatedProject = await internService.updateTeamProject(user._id, projectId, projectData);
      dispatch({ type: 'UPDATE_TEAM_PROJECT', payload: updatedProject });
      showToast('Team project updated successfully!', 'success');
      return true;
    } catch (error) {
      console.error('Error updating team project:', error);
      showToast('Failed to update team project', 'error');
      throw error;
    }
  };

  const deleteTeamProject = async (projectId) => {
    if (!isAuthenticated || !user || !user._id) {
      showToast('User not authenticated or missing ID', 'error');
      return false;
    }

    try {
      await internService.deleteTeamProject(user._id, projectId);
      dispatch({ type: 'DELETE_TEAM_PROJECT', payload: projectId });
      showToast('Team project deleted successfully!', 'success');
      return true;
    } catch (error) {
      console.error('Error deleting team project:', error);
      showToast('Failed to delete team project', 'error');
      throw error;
    }
  };

  const deleteSkill = async (skillId) => {
    if (!isAuthenticated || !user || !user._id) {
      showToast('User not authenticated or missing ID', 'error');
      return false;
    }

    try {
     
      
      await internService.deleteSkill(user._id, skillId);
      
      dispatch({ type: 'DELETE_SKILL', payload: skillId });
      
      
      // Recalculate dashboard stats after deleting skill
      setTimeout(() => recalculateDashboardStats(), 100);
      
      showToast('Skill deleted successfully!', 'success');
      return true;
    } catch (error) {
      showToast('Failed to delete skill', 'error');
      throw error;
    }
  };

  const deleteProject = async (projectId) => {
    if (!isAuthenticated || !user || !user._id) {
      showToast('User not authenticated or missing ID', 'error');
      return false;
    }

    try {
     
      
      await internService.deleteProject(user._id, projectId);
      
      dispatch({ type: 'DELETE_PROJECT', payload: projectId });
      
      showToast('Project deleted successfully!', 'success');
      return true;
    } catch (error) {
      showToast('Failed to delete project', 'error');
      throw error;
    }
  };

  const deleteFeedback = async (feedbackId) => {
    if (!isAuthenticated || !user || !user._id) {
      showToast('User not authenticated or missing ID', 'error');
      return false;
    }

    try {
      await internService.deleteFeedback(user._id, feedbackId);
      dispatch({ type: 'DELETE_FEEDBACK', payload: feedbackId });
      
      // Recalculate dashboard stats after deleting feedback
      setTimeout(() => recalculateDashboardStats(), 100);
      
      showToast('Feedback deleted successfully!', 'success');
      return true;
    } catch (error) {
      showToast('Failed to delete feedback', 'error');
      throw error;
    }
  };

  const getSocialData = async () => {
    if (!isAuthenticated || !user || !user._id) {
      return null;
    }

    try {
      const socialData = await internService.getSocialData(user._id);
      return socialData;
    } catch (error) {
      throw error;
    }
  };

  // Daily Tasks Functions
  const loadDailyTasks = async (filters = {}) => {
    
    if (!isAuthenticated || !user || !user._id) {
      showToast('User not authenticated or missing ID', 'error');
      return;
    }
    
    try {
 
      const tasks = await getDailyTasks(user._id, filters);
    
      dispatch({ type: 'SET_DAILY_TASKS', payload: tasks });
    } catch (error) {
     
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const addDailyTaskHandler = async (taskData) => {
    // Debugging logs
   
    if (!isAuthenticated || !user || !user._id) {
      showToast('User not authenticated or missing ID', 'error');
     
      return;
    }
    try {
      const newTask = await addDailyTask(user._id, taskData);
      dispatch({ type: 'ADD_DAILY_TASK', payload: newTask });
      showToast('Daily task added successfully!', 'success');
      return newTask;
    } catch (error) {
     
      dispatch({ type: 'SET_ERROR', payload: error.message });
      showToast('Failed to add daily task', 'error');
      throw error;
    }
  };

  const updateDailyTaskHandler = async (taskId, updateData) => {
    if (!isAuthenticated || !user || !user._id) {
      showToast('User not authenticated or missing ID', 'error');
      return;
    }
    try {
      const updatedTask = await updateDailyTask(user._id, taskId, updateData);
      dispatch({ type: 'UPDATE_DAILY_TASK', payload: updatedTask });
      showToast('Daily task updated successfully!', 'success');
      return updatedTask;
    } catch (error) {
    
      dispatch({ type: 'SET_ERROR', payload: error.message });
      showToast('Failed to update daily task', 'error');
      throw error;
    }
  };

  const deleteDailyTaskHandler = async (taskId) => {
    if (!isAuthenticated || !user || !user._id) {
      showToast('User not authenticated or missing ID', 'error');
      return;
    }
    try {
      await deleteDailyTask(user._id, taskId);
      dispatch({ type: 'DELETE_DAILY_TASK', payload: taskId });
      showToast('Daily task deleted successfully!', 'success');
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      showToast('Failed to delete daily task', 'error');
      throw error;
    }
  };

  const loadDailyTaskStats = async (dateRange = {}) => {
    if (!isAuthenticated || !user || !user._id) {
      showToast('User not authenticated or missing ID', 'error');
      return false;
    }

    try {
      const stats = await getDailyTaskStats(user._id, dateRange);
      dispatch({ type: 'SET_DAILY_TASK_STATS', payload: stats });
      return true;
    } catch (error) {
      showToast('Failed to load daily task stats', 'error');
      return false;
    }
  };

  // Function to refresh portfolio data specifically
  const refreshPortfolio = async () => {
    if (!isAuthenticated || !user || !user._id) {
      return;
    }

    try {
      const internId = user._id;
      const dashboardData = await internService.getDashboardData(internId);
      
      if (dashboardData && dashboardData.portfolio) {
        dispatch({ type: 'SET_PORTFOLIO', payload: dashboardData.portfolio });
      }
    } catch (error) {
      throw error;
      }
  };

  const value = {
    ...state,
    updateProfile,
    addSkill,
    updateSkill,
    deleteSkill,
    addProject,
    addFeedback,
    addMilestone,
    deleteMilestone,
    updateMilestone,
    addAchievement,
    updateAchievement,
    deleteAchievement,
    addTeamProject,
    updateTeamProject,
    deleteTeamProject,
    deleteProject,
    deleteFeedback,
    getSocialData,
    loadInternData,
    getDashboardData,
    recalculateDashboardStats,
    loadDailyTasks,
    addDailyTask: addDailyTaskHandler,
    updateDailyTask: updateDailyTaskHandler,
    deleteDailyTask: deleteDailyTaskHandler,
    loadDailyTaskStats,
    refreshPortfolio
  };

  return (
    <InternContext.Provider value={value}>
      {children}
    </InternContext.Provider>
  );
};

export const useIntern = () => {
  const context = useContext(InternContext);
  if (!context) {
    throw new Error('useIntern must be used within an InternProvider');
  }
  return context;
}; 
