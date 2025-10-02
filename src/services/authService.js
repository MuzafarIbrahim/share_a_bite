import api from './api.js';

const registerUser = async (formData) => {
  try {
    const response = await api.post('/auth/register', formData);
    return response.data;
  } catch (error) {
    // Extract error message from response or use default
    const errorMessage = error.response?.data?.error || error.message || 'Registration failed';
    throw new Error(errorMessage);
  }
};

const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'Login failed';
    throw new Error(errorMessage);
  }
};

const logoutUser = () => {
  // Clear auth data from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Export as authService object
export const authService = {
  register: registerUser,
  login: loginUser,
  logout: logoutUser
};

// Also export individual functions for backward compatibility
export { registerUser, loginUser, logoutUser };