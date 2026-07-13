import { create } from 'zustand';
import axios from 'axios';

// Create basic axios instance specifically for Auth to avoid circular dependencies with interceptors
const authAxios = axios.create({
  baseURL: '/api/auth',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send refresh token cookies
});

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('nexus_user')) || null,
  accessToken: null,
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  register: async (name, email, password, role, phoneNumber) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAxios.post('/register', {
        name,
        email,
        password,
        role,
        phoneNumber,
      });

      const { accessToken, user } = response.data;
      localStorage.setItem('nexus_user', JSON.stringify(user));
      set({ user, accessToken, isLoading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Registration failed';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAxios.post('/login', { email, password });
      const { accessToken, user } = response.data;
      localStorage.setItem('nexus_user', JSON.stringify(user));
      set({ user, accessToken, isLoading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Login failed';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authAxios.post('/logout');
    } catch (err) {
      console.error('Logout request failed:', err);
    } finally {
      localStorage.removeItem('nexus_user');
      set({ user: null, accessToken: null, isLoading: false, error: null });
    }
  },

  refreshAccessToken: async () => {
    try {
      const response = await authAxios.post('/refresh');
      const { accessToken } = response.data;
      set({ accessToken });
      return accessToken;
    } catch (err) {
      // If refresh fails, session is expired
      localStorage.removeItem('nexus_user');
      set({ user: null, accessToken: null });
      return null;
    }
  },

  setAccessToken: (token) => set({ accessToken: token }),
}));
