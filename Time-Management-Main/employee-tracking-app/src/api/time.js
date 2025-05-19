// import axios from 'axios';
// import { SERVER_URL } from '../utils/constants';

// export const startSessionAPI = async (projectId) => {
//   const token = ""; // 🔥 Add logic to get JWT token
//   const response = await axios.post(`${SERVER_URL}/api/time/start`, { projectId }, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
//   return response.data;
// };

// export const endSessionAPI = async (sessionId) => {
//   const token = ""; // 🔥 Add logic to get JWT token
//   const response = await axios.post(`${SERVER_URL}/api/time/end`, { sessionId }, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
//   return response.data;
// };

import axiosInstance from './axiosInstance';

export const startSessionAPI = async (projectId) => {
  const response = await axiosInstance.post('/api/time/start', { projectId });
  return response.data;
};

export const endSessionAPI = async (sessionId) => {
  const response = await axiosInstance.post('/api/time/end', { sessionId });
  return response.data;
};

export const getTimeLogs = async () => {
  const response = await axiosInstance.get('/api/time/logs');
  return response.data;
};
