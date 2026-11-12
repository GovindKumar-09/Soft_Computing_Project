import axios from 'axios';

import { getAccessToken } from './authService'

const BASE = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '')

const api = axios.create({
  baseURL: `${BASE}/api`,
  withCredentials: false
})

api.interceptors.request.use(config => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401) window.dispatchEvent(new Event('auth:expired'))
  return Promise.reject(error)
})

export default api
