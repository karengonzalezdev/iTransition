import axios from 'axios';

const instance = axios.create({
  baseURL: '*',
  headers: {
    'Content-Type': 'text/plain',
  },
});

export default instance;