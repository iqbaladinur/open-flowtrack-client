import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { ref } from 'vue';
import type { ApiResponse } from '@/types/api';
import { useAuthStore } from '@/stores/auth';

let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void; }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const VERSION = '/v1'
// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}${VERSION}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore();

    // Check if the error is due to an expired token
    if (error.response?.status === 401 && error.response?.data?.error === 'TokenExpiredError') {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await authStore.refreshAccessToken();
        if (newToken) {
          api.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
          originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
          processQueue(null, newToken);
          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        authStore.logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // These are the endpoints that we expect to return 401 for failed authentication attempts (e.g., wrong password).
    // We don't want to redirect to /login in these cases, as the component should handle the error message.
    const excludedFromRedirect =
      originalRequest.method.toLowerCase() === 'post' &&
      [
        '/auth/login',
        '/auth/register',
        '/auth/forgot-password',
      ].includes(originalRequest.url);

    if (error.response?.status === 401 && !excludedFromRedirect) {
      authStore.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export function useApi() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const request = async <T = any>(
    config: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    loading.value = true;
    error.value = null;

    try {
      const response: AxiosResponse<T> = await api(config);
      return { data: response.data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      error.value = errorMessage;
      return { error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  const get = <T = any>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ method: 'GET', url, ...config });

  const post = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    request<T>({ method: 'POST', url, data, ...config });

  const put = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    request<T>({ method: 'PUT', url, data, ...config });

  const patch = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    request<T>({ method: 'PATCH', url, data, ...config });

  const del = <T = any>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ method: 'DELETE', url, ...config });

  return {
    loading,
    error,
    request,
    get,
    post,
    put,
    patch,
    delete: del,
  };
}