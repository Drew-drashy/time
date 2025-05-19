import axiosInstance from './axiosInstance';

export const loginUser = async (email, password) => {
  const response = await axiosInstance.post('/api/login', { email, password });
  return response.data;
};

export const registerUser = async (userData) => {
  // console.log("popop");
  const response = await axiosInstance.post('/api/register', userData);
  // console.log(response,'response');
  return response.data;
};
