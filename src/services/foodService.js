import api from './api';

export const foodService = {
  // Create a new food post
  createFood: async (postData) => {
    try {
      const response = await api.post('/food/posts', {
        title: postData.title,
        description: postData.description,
        quantity: postData.quantity,
        pickupTimeStart: postData.pickupTimeStart,
        pickupTimeEnd: postData.pickupTimeEnd,
        category: postData.category,
        location: postData.location,
        expiryDate: postData.expiryDate,
        specialInstructions: postData.specialInstructions
      });
      return response.data;
    } catch (error) {
      console.error('Error creating food post:', error);
      throw error;
    }
  },

  // Alternative method name for backward compatibility
  createFoodPost: async (postData) => {
    return await foodService.createFood(postData);
  },

  // Get all food posts
  getAllFoods: async () => {
    try {
      const response = await api.get('/food/posts');
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching food posts:', error);
      throw error;
    }
  },

  // Get all available food posts for browsing
  getAllFoodPosts: async () => {
    return await foodService.getAllFoods();
  },

  // Get available food posts (not claimed) for welfare organizations
  getAvailableFoodPosts: async () => {
    try {
      const response = await api.get('/food/posts');
      const availablePosts = response.data.filter(post => post.status === 'available');
      return { data: availablePosts };
    } catch (error) {
      console.error('Error fetching available food posts:', error);
      throw error;
    }
  },

  // Get food posts created by current user (for restaurant dashboard)
  getUserFoodPosts: async () => {
    try {
      const response = await api.get('/food/my-posts');
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching user food posts:', error);
      throw error;
    }
  },

  // Claim a food post
  claimFood: async (postId) => {
    try {
      const response = await api.post(`/food/posts/${postId}/claim`);
      return response.data;
    } catch (error) {
      console.error('Error claiming food:', error);
      throw error;
    }
  },

  // Get claims made by current user
  getUserClaims: async () => {
    try {
      const response = await api.get('/food/my-claims');
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching user claims:', error);
      throw error;
    }
  },

  // Get all claims for admin dashboard
  getAllClaims: async () => {
    try {
      const response = await api.get('/food/my-claims');
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching all claims:', error);
      throw error;
    }
  },

  // Get admin statistics
  getAdminStats: async () => {
    try {
      // For now, calculate stats from available data
      const postsResponse = await api.get('/food/posts');
      const posts = postsResponse.data || [];
      
      const stats = {
        totalDonations: posts.length,
        activeDonations: posts.filter(post => post.status === 'available').length,
        completedDonations: posts.filter(post => post.status === 'claimed').length,
        totalClaims: posts.filter(post => post.status === 'claimed').length,
        totalRestaurants: new Set(posts.map(post => post.restaurant?.id).filter(Boolean)).size,
        totalOrganizations: new Set(posts.map(post => post.claimant?.id).filter(Boolean)).size
      };

      return { data: stats };
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw error;
    }
  },

  // Delete a food post (for restaurant owners)
  deleteFoodPost: async (postId) => {
    try {
      const response = await api.delete(`/food/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting food post:', error);
      throw error;
    }
  },

  // Update food post status (for restaurant owners)
  updateFoodPostStatus: async (postId, status) => {
    try {
      const response = await api.put(`/food/posts/${postId}`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating food post status:', error);
      throw error;
    }
  }
};