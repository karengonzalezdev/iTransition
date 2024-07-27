import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DrawingBoard from './components/DrawingBoard';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/board/:boardId" element={<DrawingBoard />} />
      </Routes>
    </Router>
  );
};

export default App;