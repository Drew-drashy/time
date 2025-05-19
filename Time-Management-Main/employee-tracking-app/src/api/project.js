// import axios from 'axios';
// import { SERVER_URL } from '../utils/constants';

// export const getAssignedProjects = async () => {
//   const token = ""; // 🔥 Add logic to get JWT token
//   const response = await axios.get(`${SERVER_URL}/api/projects`, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
//   return response.data;
// };

import axiosInstance from './axiosInstance';

export const getAssignedProjects = async () => {
  const response = await axiosInstance.get('/api/projects');
  return response.data;
};
