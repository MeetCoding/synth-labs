import React from 'react';

const Sidebar = ({ song, onAddLayer, onDeleteLayer, onSelectLayer }) => {
  return (
    <div className="sidebar">
      <h3>{song.name}</h3>
      <button onClick={onAddLayer}>Add Layer</button>
      <ul>
        {song.layers.map(layer => (
          <li key={layer.id} onClick={() => onSelectLayer(layer.id)}>
            {layer.index}: {layer.name}
            <button onClick={(e) => { e.stopPropagation(); onDeleteLayer(layer.id); }}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
