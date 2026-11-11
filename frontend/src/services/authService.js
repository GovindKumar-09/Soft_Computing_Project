import api from './api';

// 1. Register User API Call
export const registerUser = async (name, email, password) => {
    const response = await api.post('/api/auth/register', { name, email, password });
    return response.data;
};

// 2. Login User API Call
export const loginUser = async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
};

// 3. Get Current Logged In User
export const getCurrentUser = async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
};

// 4. Logout User
export const logoutUser = async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
};