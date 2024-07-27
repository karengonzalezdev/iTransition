import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BoardGallery: React.FC = () => {
  const [boards, setBoards] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get('/boards');
        setBoards(response.data);
      } catch (error) {
        console.error('Error fetching boards:', error);
      }
    };
    fetchBoards();
  }, []);

  const filteredBoards = boards.filter(board =>
    board.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search boards..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div>
        {filteredBoards.map(board => (
          <div key={board.id}>
            <h3>{board.title}</h3>
            <p>{board.description}</p>
            <a href={`/board/${board.id}`}>Open Board</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardGallery;