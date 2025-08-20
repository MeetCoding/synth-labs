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
      // We will handle selecting the layer separately now, so we can remove
      // the selection logic from here to avoid conflicts.
    } catch (error) {
      console.error("Failed to fetch song details:", error);
    }
  };

  useEffect(() => {
    const initialLoad = async () => {
      try {
        const response = await fetchSongDetails(songId);
        setSong(response.data);
        // On initial load, select the first layer if it exists.
        if (response.data.layers.length > 0) {
          setSelectedLayerId(response.data.layers[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch song details:", error);
      }
    };
    initialLoad();
  }, [songId]); // This still correctly runs only when the page/songId changes.

  const handleAddLayer = async () => {
    try {
      // FIX 1: Wrap the API call in a try...catch block.
      // We capture the response to get the new layer's ID.
      const response = await addLayer(songId, { name: "New Layer" });
      const newLayer = response.data; // Assuming your backend returns the created layer.

      // First, refresh the song list from the server.
      await loadSong(); 

      // FIX 2: Automatically select the newly created layer for a better UX.
      if (newLayer && newLayer.id) {
        setSelectedLayerId(newLayer.id);
      }

    } catch (error) {
      // Now, if the API call fails, we will see a clear error message.
      console.error("Failed to add layer:", error);
      alert("Could not add a new layer. Please check the console for errors.");
    }
  };

  const handleSaveLayer = async (layerId, data) => {
    try {
      await updateLayer(songId, layerId, data);
      alert("Layer saved successfully!");
      // We call loadSong() here to ensure the data in the sidebar is also up-to-date
      // in case the name was changed.
      await loadSong();
    } catch (error) {
      console.error("Failed to save layer:", error);
      alert("Error saving layer. Please try again.");
    }
  };

  const handleDeleteLayer = async (layerId) => {
    try {
      await deleteLayer(songId, layerId);
      
      // If the deleted layer was the one selected, deselect it.
      if (selectedLayerId === layerId) {
          setSelectedLayerId(null);
      }
      
      await loadSong();
    } catch (error) {
      console.error("Failed to delete layer:", error);
      alert("Error deleting layer.");
    }
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
            key={selectedLayer.id} 
            layerData={selectedLayer} 
            onSave={handleSaveLayer} 
          />
        ) : (
          <h2>Select a layer to start editing or add a new one.</h2>
        )}
      </main>
    </div>
  );
};

export default SongPage;
