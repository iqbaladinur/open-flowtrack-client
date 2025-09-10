import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useApi } from '@/composables/useApi';
import { useConfigStore } from './config';
import type { User } from '@/types/user';
import type { AuthResponse, ProfileResponse } from '@/types/auth';
import type { Config } from '@/types/config';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const loading = ref(false);
  const api = useApi();
  const configStore = useConfigStore();

  const isAuthenticated = computed(() => !!user.value && !!token.value);

  const loadUserFromStorage = () => {
    const storedToken = localStorage.getItem('auth_token');
    const storedRefreshToken = localStorage.getItem('refresh_token');
    const userData = localStorage.getItem('user');

    if (storedToken && userData) {
      try {
        token.value = storedToken;
        refreshToken.value = storedRefreshToken;
        user.value = JSON.parse(userData);
        configStore.loadConfigFromStorage();
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
        const { access_token, refresh_token, user: userData, config } = response.data;
        localStorage.setItem('auth_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('user', JSON.stringify(userData));
        token.value = access_token;
        refreshToken.value = refresh_token;
        user.value = userData;
        configStore.setConfig(config);
        return { success: true };
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
      const response = await api.post('/auth/register', {
        email,
        password,
        full_name: fullName,
      });

      // The register endpoint does not return a token.
      // It just confirms that the user has been created.
      // The user should then be redirected to the login page.
      if (response.data) {
        return { success: true };
      }

      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    token.value = null;
    refreshToken.value = null;
    user.value = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('config');
    configStore.setConfig({} as Config); // Reset config store
  };

  const getProfile = async () => {
    try {
      const response = await api.get<ProfileResponse>('/auth/profile');
      if (response.data) {
        const { user: userData, config } = response.data;
        user.value = userData;
        configStore.setConfig(config);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        // This case might happen if token is valid but profile endpoint fails
        logout();
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      logout(); // Also logout on error
    }
  };

  const refreshAccessToken = async () => {
    const storedRefreshToken = refreshToken.value || localStorage.getItem('refresh_token');
    if (!storedRefreshToken) {
      logout();
      return null;
    }

    try {
      const response = await api.post<AuthResponse>('/auth/refresh', {
        refresh_token: storedRefreshToken,
      });

      if (response.data) {
        const { access_token, refresh_token: new_refresh_token } = response.data;
        localStorage.setItem('auth_token', access_token);
        localStorage.setItem('refresh_token', new_refresh_token);
        token.value = access_token;
        refreshToken.value = new_refresh_token;
        return access_token;
      } else {
        logout();
        return null;
      }
    } catch (error) {
      logout();
      return null;
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

  const handleGoogleLogin = async (accessToken: string, newRefreshToken: string) => {
    localStorage.setItem('auth_token', accessToken);
    localStorage.setItem('refresh_token', newRefreshToken);
    token.value = accessToken;
    refreshToken.value = newRefreshToken;
    // After getting token, we must fetch profile to get user and config data
    await getProfile();
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
    refreshAccessToken,
  };
});
