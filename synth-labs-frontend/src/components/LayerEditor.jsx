import React, { useState, useEffect } from 'react';

const LayerEditor = ({ layerData, onSave }) => {
  // 1. Local state to manage form data independently.
  // We initialize it with the data from the layer prop.
  const [formData, setFormData] = useState(layerData.data);
  const [layerName, setLayerName] = useState(layerData.name);

  // 2. useEffect to re-synchronize the form when the user selects a different layer.
  // The 'key' prop on the component in SongPage.jsx also helps ensure a clean re-render,
  // but this makes the data sync explicit.
  useEffect(() => {
    setFormData(layerData.data);
    setLayerName(layerData.name);
  }, [layerData]); // This effect runs whenever layerData changes.

  /**
   * 3. A generic handler for nested state updates.
   * It can handle simple paths like 'volume' or nested paths like 'eq.low' or 'effects.reverb.wet'.
   * @param {string} path - The dot-notation path to the value (e.g., 'effects.reverb.wet').
   * @param {any} value - The new value from the input.
   */
  const handleChange = (path, value) => {
    setFormData(prev => {
      // Deep copy the previous state to avoid direct mutation.
      const newState = JSON.parse(JSON.stringify(prev));
      
      const keys = path.split('.');
      let current = newState;
      // Traverse the object to the second-to-last key.
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      // Set the value on the final key.
      current[keys[keys.length - 1]] = value;
      
      return newState;
    });
  };

  /**
   * 4. Handler for the "Save Changes" button.
   * It constructs the final payload and calls the onSave prop passed from the parent.
   */
  const handleSave = () => {
    const updatedLayerPayload = {
      name: layerName,
      data: formData,
    };
    // The actual API call is managed by the parent component (SongPage)
    onSave(layerData.id, updatedLayerPayload);
  };

  return (
    <div className="layer-editor">
      <h3>Editing Layer: {layerName}</h3>
      <input 
        type="text" 
        value={layerName} 
        onChange={(e) => setLayerName(e.target.value)}
        style={{ marginBottom: '20px', width: '50%' }}
      />
      <button onClick={handleSave} style={{ marginLeft: '10px' }}>Save Changes</button>
      
      <hr />

      {/* --- Main Controls --- */}
      <div>
        <label>Volume</label>
        <input 
          type="range" min="-40" max="6" step="0.1" 
          value={formData.volume} 
          onChange={e => handleChange('volume', parseFloat(e.target.value))} 
        />
        <span>{formData.volume.toFixed(1)} dB</span>
      </div>
      
      <div>
        <label>Pitch</label>
        <input 
          type="text" value={formData.pitch} 
          onChange={e => handleChange('pitch', e.target.value)} 
        />
      </div>

      <div>
        <label>Waveform</label>
        <select value={formData.waveform} onChange={e => handleChange('waveform', e.target.value)}>
          <option value="sine">Sine</option>
          <option value="square">Square</option>
          <option value="sawtooth">Sawtooth</option>
          <option value="triangle">Triangle</option>
        </select>
      </div>

      {/* --- UI for EQ --- */}
      <div className="eq-controls">
        <h4>Equalizer</h4>
        <div>
          <label>Low</label>
          <input type="range" orient="vertical" min="-12" max="12" value={formData.eq.low} onChange={e => handleChange('eq.low', Number(e.target.value))} />
          <span>{formData.eq.low} dB</span>
        </div>
        <div>
          <label>Mid</label>
          <input type="range" orient="vertical" min="-12" max="12" value={formData.eq.mid} onChange={e => handleChange('eq.mid', Number(e.target.value))} />
           <span>{formData.eq.mid} dB</span>
        </div>
        <div>
          <label>High</label>
          <input type="range" orient="vertical" min="-12" max="12" value={formData.eq.high} onChange={e => handleChange('eq.high', Number(e.target.value))} />
           <span>{formData.eq.high} dB</span>
        </div>
      </div>

      {/* --- UI for ADSR --- */}
      {/* ... (Add similar controls for ADSR envelope) ... */}

      {/* --- UI for Effects --- */}
      <div className="effects-grid">
        <h4>Effects</h4>
        {Object.keys(formData.effects).map(effectKey => (
          <div key={effectKey} className="effect-control">
            <h5>{effectKey}</h5>
            <label>Enable</label>
            <input 
              type="checkbox" 
              checked={formData.effects[effectKey].enabled}
              onChange={e => handleChange(`effects.${effectKey}.enabled`, e.target.checked)}
            />
            {/* Render sliders/inputs for other effect params if enabled */}
            {formData.effects[effectKey].enabled && Object.keys(formData.effects[effectKey]).map(paramKey => {
              if (paramKey === 'enabled') return null;
              return (
                <div key={paramKey}>
                  <label>{paramKey}</label>
                  <input
                    type="range" // Or "text", based on the param
                    min="0" max="1" step="0.01" // Adjust ranges as needed
                    value={formData.effects[effectKey][paramKey]}
                    onChange={e => handleChange(`effects.${effectKey}.${paramKey}`, parseFloat(e.target.value))}
                  />
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayerEditor;
