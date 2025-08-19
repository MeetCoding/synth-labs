import apiClient from './axiosConfig';

export const fetchSongDetails = (songId) => apiClient.get(`/songs/${songId}/`);
export const addLayer = (songId, layerData) => apiClient.post(`/songs/${songId}/layers/`, layerData);
export const updateLayer = (songId, layerId, layerData) => apiClient.put(`/songs/${songId}/layers/${layerId}/`, layerData);
export const deleteLayer = (songId, layerId) => apiClient.delete(`/songs/${songId}/layers/${layerId}/`);
