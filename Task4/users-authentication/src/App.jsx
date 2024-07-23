import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import { Home } from './pages/Home';
import { LoginPage } from './pages/Login';
import { Page404 } from './pages/Page404';
import { UserManagement } from './pages/UserManagement';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import { AuthProvider } from './hooks/useAuth';
import { RegisterPage } from './pages/Register';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<PublicRoute> <LoginPage/> </PublicRoute>} />
          <Route path='/register' element={<PublicRoute> <RegisterPage /> </PublicRoute>} />
          <Route path="/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;