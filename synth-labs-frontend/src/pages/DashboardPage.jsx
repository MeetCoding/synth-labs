import React, { useState, useEffect } from 'react';
import { fetchSongs, createSong, deleteSong } from '../api/songs';
import SongCard from '../components/SongCard';

const DashboardPage = () => {
  const [songs, setSongs] = useState([]);
  const [newSongName, setNewSongName] = useState('');

  const loadSongs = async () => {
    try {
      const response = await fetchSongs();
      setSongs(response.data);
    } catch (error) {
      console.error("Failed to fetch songs:", error);
    }
  };

  useEffect(() => {
    loadSongs();
  }, []);

  const handleCreateSong = async () => {
    if (!newSongName) return;
    try {
      await createSong({ name: newSongName });
      setNewSongName('');
      loadSongs(); // Refresh the list
    } catch (error) {
      console.error("Failed to create song:", error);
    }
  };

  const handleDeleteSong = async (songId) => {
    try {
      await deleteSong(songId);
      loadSongs(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete song:", error);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="new-song-card">
        <h3>New Song</h3>
        <input 
          type="text" 
          placeholder="Name" 
          value={newSongName}
          onChange={(e) => setNewSongName(e.target.value)}
        />
        <button onClick={handleCreateSong}>Compose</button>
      </div>
      <div className="song-grid">
        {songs.map(song => (
          <SongCard key={song.id} song={song} onDelete={handleDeleteSong} />
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
