import React, { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import ToolPanel from './ToolPanel';
import axios from 'axios';

const socket = io();

const DrawingBoard: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState('#000000');
  const [drawing, setDrawing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const loadDrawings = async () => {
      try {
        const response = await axios.get(`/api/drawings/${boardId}`);
        const drawings = response.data;
        drawings.forEach((data: any) => {
          ctx.beginPath();
          ctx.strokeStyle = data.color;
          ctx.lineWidth = 2;
          if (data.tool === 'pencil') {
            ctx.moveTo(data.x0, data.y0);
            ctx.lineTo(data.x1, data.y1);
          } else if (data.tool === 'rectangle') {
            const width = data.x1 - data.x0;
            const height = data.y1 - data.y0;
            ctx.strokeRect(data.x0, data.y0, width, height);
          } else if (data.tool === 'circle') {
            const radius = Math.sqrt(
              Math.pow(data.x1 - data.x0, 2) + Math.pow(data.y1 - data.y0, 2)
            );
            ctx.arc(data.x0, data.y0, radius, 0, Math.PI * 2);
          } else if (data.tool === 'text') {
            ctx.font = '16px Arial';
            ctx.fillStyle = data.color;
            ctx.fillText(data.text, data.x0, data.y0);
          } else if (data.tool === 'eraser') {
            ctx.clearRect(data.x0, data.y0, data.width, data.height);
          }
          ctx.stroke();
        });
      } catch (err) {
        console.error('Error loading drawings', err);
      }
    };

    loadDrawings();

    const handleDraw = (data: any) => {
      if (ctx) {
        ctx.beginPath();
        ctx.strokeStyle = data.color;
        ctx.lineWidth = 2;
        if (data.tool === 'pencil') {
          ctx.moveTo(data.x0, data.y0);
          ctx.lineTo(data.x1, data.y1);
        } else if (data.tool === 'rectangle') {
          const width = data.x1 - data.x0;
          const height = data.y1 - data.y0;
          ctx.strokeRect(data.x0, data.y0, width, height);
        } else if (data.tool === 'circle') {
          const radius = Math.sqrt(
            Math.pow(data.x1 - data.x0, 2) + Math.pow(data.y1 - data.y0, 2)
          );
          ctx.arc(data.x0, data.y0, radius, 0, Math.PI * 2);
        } else if (data.tool === 'text') {
          ctx.font = '16px Arial';
          ctx.fillStyle = data.color;
          ctx.fillText(data.text, data.x0, data.y0);
        } else if (data.tool === 'eraser') {
          ctx.clearRect(data.x0, data.y0, data.width, data.height);
        }
        ctx.stroke();
      }
    };

    socket.on('draw', handleDraw);

    return () => {
      socket.off('draw', handleDraw);
    };
  }, [boardId]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      setStartX(e.clientX - rect.left);
      setStartY(e.clientY - rect.top);
      setDrawing(true);
    }
  };

  const handleMouseUp = async (e: React.MouseEvent) => {
    if (drawing) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const rect = canvas.getBoundingClientRect();
          const x0 = startX;
          const y0 = startY;
          const x1 = e.clientX - rect.left;
          const y1 = e.clientY - rect.top;
          ctx.beginPath();
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          if (tool === 'pencil') {
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
          } else if (tool === 'rectangle') {
            const width = x1 - x0;
            const height = y1 - y0;
            ctx.strokeRect(x0, y0, width, height);
          } else if (tool === 'circle') {
            const radius = Math.sqrt(
              Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2)
            );
            ctx.arc(x0, y0, radius, 0, Math.PI * 2);
          } else if (tool === 'text') {
            ctx.font = '16px Arial';
            ctx.fillStyle = color;
            ctx.fillText('Sample Text', x0, y0);
          } else if (tool === 'eraser') {
            const width = 10;
            const height = 10;
            ctx.clearRect(x0 - width / 2, y0 - height / 2, width, height);
          }
          ctx.stroke();
          await axios.post('/api/drawings', {
            boardId,
            tool,
            color,
            x0,
            y0,
            x1,
            y1,
            text: tool === 'text' ? 'Sample Text' : '',
            width: 10,
            height: 10,
          });
          socket.emit('draw', { tool, color, x0, y0, x1, y1, text: tool === 'text' ? 'Sample Text' : '', width: 10, height: 10 });
        }
      }
      setDrawing(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (drawing) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const rect = canvas.getBoundingClientRect();
          const x0 = startX;
          const y0 = startY;
          const x1 = e.clientX - rect.left;
          const y1 = e.clientY - rect.top;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          socket.emit('draw', { tool, color, x0, y0, x1, y1 });
          ctx.beginPath();
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          if (tool === 'pencil') {
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
          } else if (tool === 'rectangle') {
            const width = x1 - x0;
            const height = y1 - y0;
            ctx.strokeRect(x0, y0, width, height);
          } else if (tool === 'circle') {
            const radius = Math.sqrt(
              Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2)
            );
            ctx.arc(x0, y0, radius, 0, Math.PI * 2);
          } else if (tool === 'text') {
            ctx.font = '16px Arial';
            ctx.fillStyle = color;
            ctx.fillText('Sample Text', x0, y0);
          } else if (tool === 'eraser') {
            const width = 10;
            const height = 10;
            ctx.clearRect(x0 - width / 2, y0 - height / 2, width, height);
          }
          ctx.stroke();
        }
      }
    }
  };

  return (
    <div>
      <ToolPanel setTool={setTool} setColor={setColor} />
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ border: '1px solid black' }}
      />
    </div>
  );
};

export default DrawingBoard;