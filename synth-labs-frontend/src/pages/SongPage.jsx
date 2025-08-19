import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSongDetails, addLayer, deleteLayer, updateLayer } from '../api/layers';
import Sidebar from '../components/Sidebar';
import LayerEditor from '../components/LayerEditor';

const SongPage = () => {
  const { songId } = useParams();
  const [song, setSong] = useState(null);
  const [selectedLayerId, setSelectedLayerId] = useState(null);

  const loadSong = async () => {
    try {
      const response = await fetchSongDetails(songId);
      setSong(response.data);
      // Select the first layer by default if it exists
      if (response.data.layers.length > 0 && !selectedLayerId) {
        setSelectedLayerId(response.data.layers[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch song details:", error);
    }
  };

  useEffect(() => {
    loadSong();
  }, [songId]);

  const handleAddLayer = async () => {
    await addLayer(songId, { name: "New Layer" });
    loadSong();
  };

  const handleDeleteLayer = async (layerId) => {
    await deleteLayer(songId, layerId);
    // If the deleted layer was selected, select another one or none
    if (selectedLayerId === layerId) {
        setSelectedLayerId(null);
    }
    loadSong();
  };

  const handleSaveLayer = async (layerId, data) => {
    await updateLayer(songId, layerId, data);
    loadSong(); // Refresh to ensure data consistency
  };

  const selectedLayer = song?.layers.find(l => l.id === selectedLayerId);

  if (!song) return <div>Loading...</div>;

  return (
    <div className="song-page-container">
      <Sidebar 
        song={song} 
        onAddLayer={handleAddLayer}
        onDeleteLayer={handleDeleteLayer}
        onSelectLayer={setSelectedLayerId}
      />
      <main className="main-content">
        {selectedLayer ? (
          <LayerEditor 
            key={selectedLayer.id} // Important for re-rendering when layer changes
            layerData={selectedLayer} 
            onSave={handleSaveLayer} 
          />
        ) : (
          <h2>Select a layer to start editing</h2>
        )}
      </main>
    </div>
  );
};

export default SongPage;
