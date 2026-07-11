import apiClient from './client';

export const fetchProfile = async () => {
  const { data } = await apiClient.get('/profile');
  return data;
};

export const updateProfile = async (profile) => {
  const { data } = await apiClient.put('/profile', profile);
  return data;
};
