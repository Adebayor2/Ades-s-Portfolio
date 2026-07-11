import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Edit2, Trash2, Plus, X, ExternalLink, Star } from 'lucide-react';
import { createProject, deleteProject, fetchProjects, updateProject } from '../api/projects';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  techStack: z.string().min(1, 'Tech stack is required (comma separated)'),
  githubUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  thumbnail: z.string().url('Must be a valid URL'),
  category: z.string().min(1, 'Category is required'),
  featured: z.boolean().default(false),
});

const AdminDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: () => fetchProjects()
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: { featured: false }
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const payload = {
        ...data,
        techStack: data.techStack.split(',').map((s) => s.trim()).filter(Boolean),
      };

      return editingProject
        ? updateProject(editingProject._id, payload)
        : createProject(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      closeModal();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  const openModal = (project = null) => {
    setEditingProject(project);
    if (project) {
      Object.keys(project).forEach(key => {
        if (key === 'techStack') {
          setValue('techStack', project.techStack.join(', '));
        } else if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt') {
          setValue(key, project[key] || '');
        }
      });
    } else {
      reset({ techStack: '', githubUrl: '', liveUrl: '', category: 'Web Apps', featured: false });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    reset();
  };

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="text-gray-400">Loading projects...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Projects</h3>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus size={18} /> Add Project
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-700/50 text-gray-400 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Project</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium text-center">Featured</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {projects?.map(project => (
              <tr key={project._id} className="hover:bg-gray-700/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img src={project.thumbnail} alt="" className="w-12 h-12 rounded object-cover bg-gray-700" />
                    <div>
                      <div className="font-semibold text-gray-100">{project.title}</div>
                      <div className="text-xs text-gray-500 mt-1 flex gap-2">
                        {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="hover:text-blue-400"><ExternalLink size={12} className="inline mr-1"/>GitHub</a>}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-300">
                  <span className="px-2.5 py-1 bg-gray-700 rounded-full text-xs">{project.category}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  {project.featured ? <Star className="inline text-yellow-500 fill-yellow-500" size={16} /> : <span className="text-gray-600">-</span>}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => openModal(project)} className="text-gray-400 hover:text-blue-400 transition-colors p-1 rounded hover:bg-gray-700">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(project._id)} className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded hover:bg-gray-700">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-2xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-700 shrink-0">
              <h3 className="text-lg font-semibold text-white">{editingProject ? 'Edit Project' : 'New Project'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <form id="project-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                    <input {...register('title')} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                    {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                    <select {...register('category')} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                      <option value="Web Apps">Web Apps</option>
                      <option value="Website">Websites</option>
                      <option value="Open Source">Open Source</option>
                      <option value="Experiments">Experiments</option>
                    </select>
                    {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea {...register('description')} rows={4} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none" />
                  {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Tech Stack (comma separated)</label>
                  <input {...register('techStack')} placeholder="React, Node.js, MongoDB" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  {errors.techStack && <p className="text-red-400 text-xs mt-1">{errors.techStack.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-300 mb-1">GitHub URL (optional)</label>
                    <input {...register('githubUrl')} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                    {errors.githubUrl && <p className="text-red-400 text-xs mt-1">{errors.githubUrl.message}</p>}
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Live URL (optional)</label>
                    <input {...register('liveUrl')} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                    {errors.liveUrl && <p className="text-red-400 text-xs mt-1">{errors.liveUrl.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Thumbnail URL</label>
                  <input {...register('thumbnail')} placeholder="https://example.com/image.jpg" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  {errors.thumbnail && <p className="text-red-400 text-xs mt-1">{errors.thumbnail.message}</p>}
                </div>

                <div className="flex items-center gap-3 py-2">
                  <input type="checkbox" id="featured" {...register('featured')} className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800" />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-300 select-none cursor-pointer">Featured Project</label>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-700 shrink-0 flex justify-end gap-3 bg-gray-800">
              <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-lg transition-colors">
                Cancel
              </button>
              <button 
                type="submit" 
                form="project-form" 
                disabled={mutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {mutation.isPending ? 'Saving...' : 'Save Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;


