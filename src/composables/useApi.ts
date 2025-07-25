import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { ref } from 'vue';
import type { ApiResponse } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
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
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
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