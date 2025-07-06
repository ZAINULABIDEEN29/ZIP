import axios from 'axios';


const BACKEND_URL= import.meta.env.VITE_API_URL;


// Create axios instance with default config
const api = axios.create({
  baseURL: `${BACKEND_URL}/interns`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle 401 errors (token expired)
    if (error.response && error.response.status === 401) {
      console.warn('Token expired or invalid. Clearing auth data...');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      // Redirect to login page
      window.location.href = '/auth/login';
    }
    throw error;
  }
);

export const internService = {
  // Get intern profile
  getInternById: (id) => api.get(`/${id}`),
  
  // Update intern profile
  updateProfile: (id, data) => api.put(`/${id}`, data),
  
  // Get intern skills
  getSkills: (id) => api.get(`/${id}/skills`),
  
  // Update skill
  updateSkill: (id, skillId, data) => api.put(`/${id}/skills/${skillId}`, data),
  
  // Add new skill
  addSkill: (id, skillData) => api.post(`/${id}/skills`, skillData),
  
  // Delete skill
  deleteSkill: (id, skillId) => api.delete(`/${id}/skills/${skillId}`),
  
  // Get portfolio projects
  getPortfolio: (id) => api.get(`/${id}/portfolio`),
  
  // Add portfolio project
  addProject: (id, projectData) => api.post(`/${id}/portfolio`, projectData),
  
  // Update portfolio project
  updateProject: (id, projectId, data) => api.put(`/${id}/portfolio/${projectId}`, data),
  
  // Delete portfolio project
  deleteProject: (id, projectId) => api.delete(`/${id}/portfolio/${projectId}`),
  
  // Get feedback
  getFeedback: (id) => api.get(`/${id}/feedback`),
  
  // Add feedback
  addFeedback: (id, feedbackData) => api.post(`/${id}/feedback`, feedbackData),
  
  // Delete feedback
  deleteFeedback: (id, feedbackId) => api.delete(`/${id}/feedback/${feedbackId}`),
  
  // Get progress timeline
  getProgress: (id) => api.get(`/${id}/progress`),
  
  // Add progress milestone
  addMilestone: (id, milestoneData) => api.post(`/${id}/progress`, milestoneData),
  
  // Update progress milestone
  updateMilestone: (id, milestoneId, data) => api.put(`/${id}/progress/${milestoneId}`, data),
  
  // Delete progress milestone
  deleteMilestone: (id, milestoneId) => api.delete(`/${id}/progress/${milestoneId}`),
  
  // Get social achievements
  getAchievements: (id) => api.get(`/${id}/achievements`),
  
  // Add achievement
  addAchievement: (id, achievementData) => api.post(`/${id}/achievements`, achievementData),
  
  // Update achievement
  updateAchievement: (id, achievementId, data) => api.put(`/${id}/achievements/${achievementId}`, data),
  
  // Delete achievement
  deleteAchievement: (id, achievementId) => api.delete(`/${id}/achievements/${achievementId}`),
  
  // Get team collaboration data
  getTeamProjects: (id) => api.get(`/${id}/team-projects`),
  
  // Add team project
  addTeamProject: (id, projectData) => api.post(`/${id}/team-projects`, projectData),
  
  // Update team project
  updateTeamProject: (id, projectId, data) => api.put(`/${id}/team-projects/${projectId}`, data),
  
  // Delete team project
  deleteTeamProject: (id, projectId) => api.delete(`/${id}/team-projects/${projectId}`),
  
  // Get dashboard data (aggregated)
  getDashboardData: (id) => api.get(`/${id}/dashboard`),
  
  // Get social data (achievements + team projects)
  getSocialData: (id) => api.get(`/${id}/social`),
};

export default internService;

// Daily Tasks Services
export const getDailyTasks = async (internId, filters = {}) => {
  try {
    const token = localStorage.getItem('authToken');
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${BACKEND_URL}/interns/${internId}/daily-tasks?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch daily tasks');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const addDailyTask = async (internId, taskData) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${BACKEND_URL}/interns/${internId}/daily-tasks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to add daily task');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateDailyTask = async (internId, taskId, updateData) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${BACKEND_URL}/interns/${internId}/daily-tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update daily task');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteDailyTask = async (internId, taskId) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${BACKEND_URL}/interns/${internId}/daily-tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete daily task');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getDailyTaskStats = async (internId, dateRange = {}) => {
  try {
    const token = localStorage.getItem('authToken');
    const queryParams = new URLSearchParams(dateRange).toString();
    const response = await fetch(`${BACKEND_URL}/interns/${internId}/daily-tasks-stats?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch daily task stats');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching daily task stats:', error);
    throw error;
  }
}; 