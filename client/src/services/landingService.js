// const API_BASE_URL = 'http://localhost:5000/api';

const BACKEND_URL= import.meta.env.VITE_API_URL;

export const landingService = {
  // Get all interns for landing page
  async getAllInterns(category = 'all') {
    try {
      const response = await fetch(`${BACKEND_URL}/api/interns/landing/all?category=${category}`);
      if (!response.ok) {
        throw new Error('Failed to fetch interns');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching interns:', error);
      throw error;
    }
  },

  // Get categories with counts
  async getCategoriesWithCounts() {
    try {
      const response = await fetch(`${BACKEND_URL}/api/interns/landing/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
}; 