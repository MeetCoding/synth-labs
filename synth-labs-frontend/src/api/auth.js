import apiClient from './axiosConfig';

export const loginUser = (credentials) => apiClient.post('/token/', credentials);
export const registerUser = (credentials) => apiClient.post('/register/', credentials);
