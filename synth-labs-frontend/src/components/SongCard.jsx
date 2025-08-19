import React from 'react';
import { useNavigate } from 'react-router-dom';

const SongCard = ({ song, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="song-card">
      <div onClick={() => navigate(`/song/${song.id}`)} style={{cursor: 'pointer'}}>
        <h3>{song.name}</h3>
        <p>Layers: {song.layer_count}</p>
        <p>Created: {new Date(song.created_at).toLocaleDateString()}</p>
      </div>
      <button onClick={() => onDelete(song.id)}>Delete</button>
    </div>
  );
};

export default SongCard;
