import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useApi } from '@/composables/useApi';
import type { User, AuthResponse } from '@/types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const loading = ref(false);
  const api = useApi();

  const isAuthenticated = computed(() => !!user.value);

  const loadUserFromStorage = () => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        user.value = JSON.parse(userData);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        logout();
      }
    }
  };

  const login = async (email: string, password: string) => {
    loading.value = true;
    try {
      const response = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
      });

      if (response.data) {
        const { access_token } = response.data;
        localStorage.setItem('auth_token', access_token);
        await getProfile();
        if (user.value) {
          return { success: true };
        } else {
          // If getProfile fails, token is invalid or profile is missing
          logout();
          return { success: false, error: 'Failed to fetch user profile.' };
        }
      }

      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    } finally {
      loading.value = false;
    }
  };

  const register = async (email: string, password: string, fullName?: string) => {
    loading.value = true;
    try {
      const response = await api.post<AuthResponse>('/auth/register', {
        email,
        password,
        full_name: fullName,
      });

      if (response.data) {
        const { access_token } = response.data;
        localStorage.setItem('auth_token', access_token);
        await getProfile();
        if (user.value) {
          return { success: true };
        } else {
          logout();
          return { success: false, error: 'Failed to fetch user profile after registration.' };
        }
      }

      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    user.value = null;
  };

  const getProfile = async () => {
    try {
      const response = await api.get<User>('/auth/profile');
      if (response.data) {
        user.value = response.data;
        localStorage.setItem('user', JSON.stringify(response.data));
      } else {
        // This case might happen if token is valid but profile endpoint fails
        logout();
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      logout(); // Also logout on error
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return { success: !response.error, error: response.error };
    } catch (error) {
      return { success: false, error: 'Failed to send reset email' };
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      const response = await api.post(`/auth/reset-password/${token}`, {
        password,
      });
      return { success: !response.error, error: response.error };
    } catch (error) {
      return { success: false, error: 'Failed to reset password' };
    }
  };

  const handleGoogleLogin = (token: string, userData: User) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    user.value = userData;
  };

  return {
    user,
    loading,
    isAuthenticated,
    loadUserFromStorage,
    login,
    register,
    logout,
    getProfile,
    forgotPassword,
    resetPassword,
    handleGoogleLogin,
  };
});
