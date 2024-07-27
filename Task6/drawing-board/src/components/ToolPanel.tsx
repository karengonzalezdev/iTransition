import React from 'react';

interface ToolPanelProps {
  setTool: React.Dispatch<React.SetStateAction<string>>;
  setColor: React.Dispatch<React.SetStateAction<string>>;
}

const ToolPanel: React.FC<ToolPanelProps> = ({ setTool, setColor }) => {
  return (
    <div>
      <button onClick={() => setTool('pencil')}>Pencil</button>
      <button onClick={() => setTool('rectangle')}>Rectangle</button>
      <button onClick={() => setTool('circle')}>Circle</button>
      <button onClick={() => setTool('eraser')}>Eraser</button>
      <button onClick={() => setTool('text')}>Text</button>
      <input
        type="color"
        onChange={(e) => setColor(e.target.value)}
        defaultValue="#000000"
      />
    </div>
  );
};

export default ToolPanel;