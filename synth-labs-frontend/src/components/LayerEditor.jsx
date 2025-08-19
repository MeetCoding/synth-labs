import React, { useState, useEffect } from 'react';

const LayerEditor = ({ layerData, onSave }) => {
  const [formData, setFormData] = useState(layerData.data);

  useEffect(() => {
    setFormData(layerData.data);
  }, [layerData]);

  const handleChange = (path, value) => {
    // A helper to update nested state
    const keys = path.split('.');
    setFormData(prev => {
      let newState = { ...prev };
      let current = newState;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newState;
    });
  };

  const handleSave = () => {
    onSave(layerData.id, { name: layerData.name, data: formData });
  };

  return (
    <div className="layer-editor">
      <button onClick={handleSave}>Save Changes</button>
      
      {/* Volume */}
      <label>Volume</label>
      <input type="range" min="-40" max="6" value={formData.volume} onChange={e => handleChange('volume', Number(e.target.value))} />
      
      {/* Pitch */}
      <label>Pitch</label>
      <input type="text" value={formData.pitch} onChange={e => handleChange('pitch', e.target.value)} />
      
      {/* Waveform */}
      <label>Waveform</label>
      <select value={formData.waveform} onChange={e => handleChange('waveform', e.target.value)}>
        <option value="sine">Sine</option>
        <option value="square">Square</option>
        <option value="sawtooth">Sawtooth</option>
        <option value="triangle">Triangle</option>
      </select>
      
      {/* EQ */}
      <div>
        <h4>EQ</h4>
        <input type="range" orient="vertical" value={formData.eq.low} onChange={e => handleChange('eq.low', Number(e.target.value))} />
        <input type="range" orient="vertical" value={formData.eq.mid} onChange={e => handleChange('eq.mid', Number(e.target.value))} />
        <input type="range" orient="vertical" value={formData.eq.high} onChange={e => handleChange('eq.high', Number(e.target.value))} />
      </div>

      {/* Add other UI elements for ADSR, Panning, and all the effects here... */}
    </div>
  );
};

export default LayerEditor;
