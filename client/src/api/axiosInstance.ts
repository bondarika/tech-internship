import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // если расширять аавторизацией:
  // withCredentials: true,  
});
