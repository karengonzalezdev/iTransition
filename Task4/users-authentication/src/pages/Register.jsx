import React, { useState } from 'react';
import axios from '../axiosConfig';
import { NavLink, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorAuth, setErrorAuth] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (name === '' || email === '' || password === '') {
      setError(true);
      return;
    }

    try {
      const response = await axios.post('/register', {
        name: name,
        email: email,
        password: password,
      });

      if (response.data.success) {
        navigate('/login');
      } else {
        setErrorAuth(true);
      }
    } catch (error) {
      setErrorAuth(true);
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Register</h1>
      <form className="register-form" onSubmit={handleRegister}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name:</label>
          <input
            id="name"
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            id="email"
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password:</label>
          <input
            id="password"
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Register</button>
      </form>
      {error && <div className="alert alert-danger mt-3">All fields are required!</div>}
      {errorAuth && <div className="alert alert-danger mt-3">Registration failed!</div>}
      <div className="text-center mt-3">
        <NavLink to="/login" className="btn btn-link">Login</NavLink>
      </div>
    </div>
  );
};