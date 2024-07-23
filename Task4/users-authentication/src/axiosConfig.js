import axios from 'axios';

const token = localStorage.getItem('token');

const instance = axios.create({
  baseURL: 'https://users-authentication-backend.vercel.app',
  headers: {
    'Content-Type': 'application/json',
    'x-access-token': token
  },
});

export default instance;