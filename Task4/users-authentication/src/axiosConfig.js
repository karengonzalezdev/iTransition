import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://users-authentication-backend.vercel.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;