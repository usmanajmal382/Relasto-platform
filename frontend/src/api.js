import axios from 'axios';

const api = axios.create({
  baseURL: 'https://relasto-platform-production.up.railway.app/api/',
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for automatic token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        try {
          const res = await axios.post('https://relasto-platform-production.up.railway.app/api/token/refresh/', {
            refresh: refreshToken
          });
          
          if (res.status === 200) {
            localStorage.setItem('access', res.data.access);
            
            // Retry the original request with the new token
            originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
            return axios(originalRequest);
          }
        } catch (refreshError) {
          // Refresh token has expired or is invalid
          console.error('Session expired. Please log in again.');
          localStorage.removeItem('access');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      } else {
        // No refresh token available, force logout
        localStorage.removeItem('access');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
