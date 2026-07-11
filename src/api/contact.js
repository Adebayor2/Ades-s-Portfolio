import apiClient from './client';

export const sendContactMessage = async (message) => {
  const { data } = await apiClient.post('/contact', message);
  return data;
};

export const fetchContactMessages = async () => {
  const { data } = await apiClient.get('/contact');
  return data;
};
