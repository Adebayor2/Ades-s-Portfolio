import apiClient from './client';

export const fetchProjects = async ({ category, sort } = {}) => {
  const params = new URLSearchParams();
  if (category && category !== 'All') params.set('category', category);
  if (sort) params.set('sort', sort);

  const { data } = await apiClient.get('/projects', { params });
  return data;
};

export const fetchProject = async (id) => {
  const { data } = await apiClient.get(`/projects/${id}`);
  return data;
};

export const createProject = async (project) => {
  const { data } = await apiClient.post('/projects', project);
  return data;
};

export const updateProject = async (id, project) => {
  const { data } = await apiClient.put(`/projects/${id}`, project);
  return data;
};

export const deleteProject = async (id) => {
  await apiClient.delete(`/projects/${id}`);
  return id;
};
