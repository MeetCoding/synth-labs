import apiClient from './axiosConfig';

export const fetchSongs = () => apiClient.get('/songs/');
export const createSong = (songData) => apiClient.post('/songs/', songData);
export const deleteSong = (songId) => apiClient.delete(`/songs/${songId}/`);
