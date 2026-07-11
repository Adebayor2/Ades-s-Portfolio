import apiClient from './client';

export const loginAdmin = async (password) => {
  const { data } = await apiClient.post('/auth/login', { password });
  return data;
};
