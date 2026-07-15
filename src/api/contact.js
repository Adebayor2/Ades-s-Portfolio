import apiClient from './client';

export const sendContactMessage = async (message) => {
  const { data } = await apiClient.post('/contacts', message);
  return data;
};

export const fetchContactMessages = async () => {
  const { data } = await apiClient.get('/contacts');
  return data;
};
