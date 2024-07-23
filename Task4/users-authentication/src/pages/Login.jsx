import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import axios from '../axiosConfig';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorAuth, setErrorAuth] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email === '' || password === '') {
      setError(true);
      return;
    }

    try {
      const response = await axios.post('https://users-authentication-psi.vercel.app/login', {
        email: email,
        password: password,
      });

      console.log('Response from server:', response);

      if (response.data.auth) {
        await login({ user: email });
        localStorage.setItem('token', response.data.token);
        setIsAuth(true);
      } else {
        setErrorAuth(true);
      }
    } catch (error) {
      setErrorAuth(true);
      console.log(error.response.data + "This is the error");
    }
  };

  return (
    <section className="container mt-5">
      <NavLink to="/">Home</NavLink>
      <h1 className="text-center">Login</h1>
      <form className="login-form" onSubmit={handleLogin}>
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

        <button type="submit" className="btn btn-primary w-100">Sign In</button>
      </form>
      {error && <p className="text-danger mt-3">Email and password cannot be empty!</p>}
      {errorAuth && <p className="text-danger mt-3">Invalid email or password!</p>}
      <div className="text-center mt-3">
        <NavLink to="/register">Register</NavLink>
      </div>
    </section>
  );
};