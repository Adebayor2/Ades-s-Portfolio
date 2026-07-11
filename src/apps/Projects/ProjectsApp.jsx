import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '../../api/projects';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid, List, Search, ChevronDown, Folder, Globe,
  Star, AlertTriangle, RefreshCw, ExternalLink, X,
  Calendar, Tag, Menu, GitBranch,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────
const CATEGORIES  = ['All', 'Web Apps', 'website', 'Open Source', 'Experiments'];
const SORT_OPTIONS = [
  { label: 'Newest',   value: 'newest' },
  { label: 'Oldest',   value: 'oldest' },
  { label: 'Featured', value: 'featured' },
];

// ─── Tech Badge Colors ────────────────────────────────────
const TECH_COLORS = {
  React:      'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300',
  Node:       'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  MongoDB:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  Express:    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
  TypeScript: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  JavaScript: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
  Python:     'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
  Tailwind:   'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300',
};
const getTechColor = (t) =>
  TECH_COLORS[t] || 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300';

// ─── Skeletons ────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden animate-pulse bg-white dark:bg-[#2a2a2a]">
    <div className="h-36 bg-gray-200 dark:bg-gray-700" />
    <div className="p-3 space-y-2">
      <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
      <div className="flex gap-1.5 pt-1">
        <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="h-4 w-14 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
    </div>
  </div>
);

const SkeletonList = () => (
  <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700/50 animate-pulse">
    <div className="w-9 h-9 rounded bg-gray-200 dark:bg-gray-700 shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
    </div>
  </div>
);

// ─── Grid Card ────────────────────────────────────────────
const ProjectGridCard = ({ project, onClick }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
    onClick={() => onClick(project)}
    className="group relative rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden
      bg-white dark:bg-[#2a2a2a] cursor-default transition-shadow"
  >
    {project.featured && (
      <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
        <Star size={9} fill="currentColor" /> FEATURED
      </div>
    )}

    {/* Thumbnail */}
    <div className="h-36 overflow-hidden bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-sky-500/20 flex items-center justify-center">
      {project.thumbnail
        ? <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
        : <Folder size={44} className="text-[#00A4EF]/40" strokeWidth={1} />}
    </div>

    {/* Content */}
    <div className="p-3">
      <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate mb-1">{project.title}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{project.description}</p>

      <div className="flex flex-wrap gap-1 mb-3">
        {project.techStack?.slice(0, 3).map(t => (
          <span key={t} className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${getTechColor(t)}`}>{t}</span>
        ))}
        {project.techStack?.length > 3 && (
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500">
            +{project.techStack.length - 3}
          </span>
        )}
      </div>

      <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-700/50">
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
            className="flex items-center gap-1 text-[11px] text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
            <GitBranch size={11} /> Code
          </a>
        )}
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
            className="flex items-center gap-1 text-[11px] text-[#00A4EF] hover:text-blue-600 transition-colors ml-auto">
            <Globe size={11} /> Live Demo
          </a>
        )}
      </div>
    </div>
  </motion.div>
);

// ─── List Row ─────────────────────────────────────────────
const ProjectListRow = ({ project, onClick }) => (
  <motion.div
    layout
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0 }}
    onClick={() => onClick(project)}
    className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700/30
      hover:bg-gray-50 dark:hover:bg-white/5 cursor-default group transition-colors"
  >
    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-400/20 to-purple-400/20 flex items-center justify-center shrink-0">
      {project.thumbnail
        ? <img src={project.thumbnail} alt={project.title} className="w-9 h-9 rounded-lg object-cover" />
        : <Folder size={18} className="text-[#00A4EF]" strokeWidth={1.5} />}
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5">
        <h3 className="font-medium text-xs text-gray-900 dark:text-white truncate">{project.title}</h3>
        {project.featured && <Star size={10} className="text-amber-400 shrink-0" fill="currentColor" />}
      </div>
      <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{project.description}</p>
    </div>

    {/* Tech badges — shown on md+ */}
    <div className="hidden md:flex gap-1 shrink-0">
      {project.techStack?.slice(0, 3).map(t => (
        <span key={t} className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${getTechColor(t)}`}>{t}</span>
      ))}
    </div>

    {/* Link icons */}
    <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
      {project.githubUrl && (
        <a href={project.githubUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
          className="text-gray-500 hover:text-black dark:hover:text-white transition-colors">
          <GitBranch size={13} />
        </a>
      )}
      {project.liveUrl && (
        <a href={project.liveUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
          className="text-[#00A4EF] hover:text-blue-600 transition-colors">
          <ExternalLink size={13} />
        </a>
      )}
    </div>
  </motion.div>
);

// ─── Detail Side Panel ────────────────────────────────────
const DetailPanel = ({ project, onClose }) => (
  <motion.div
    initial={{ x: '100%', opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: '100%', opacity: 0 }}
    transition={{ type: 'spring', damping: 26, stiffness: 260 }}
    className="
      /* On mobile: overlay full width. On sm+: fixed sidebar */
      absolute inset-0 sm:static sm:w-64 shrink-0
      border-l border-gray-200 dark:border-gray-700/50
      bg-gray-50 dark:bg-[#252525]
      flex flex-col overflow-hidden
      z-20
    "
  >
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700/50 shrink-0">
      <h4 className="font-semibold text-sm text-gray-800 dark:text-white truncate">{project.title}</h4>
      <button onClick={onClose} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10 transition-colors ml-2 shrink-0">
        <X size={14} />
      </button>
    </div>

    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <div className="h-32 rounded-lg overflow-hidden bg-gradient-to-br from-blue-400/20 to-purple-400/20 flex items-center justify-center">
        {project.thumbnail
          ? <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
          : <Folder size={36} className="text-[#00A4EF]/40" strokeWidth={1} />}
      </div>

      <div className="flex flex-wrap gap-1">
        {project.featured && (
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            <Star size={9} fill="currentColor" /> FEATURED
          </span>
        )}
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
          {project.category}
        </span>
      </div>

      <div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Description</p>
        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{project.description}</p>
      </div>

      <div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
          <Tag size={9} /> Tech Stack
        </p>
        <div className="flex flex-wrap gap-1">
          {project.techStack?.map(t => (
            <span key={t} className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${getTechColor(t)}`}>{t}</span>
          ))}
        </div>
      </div>

      {project.createdAt && (
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Calendar size={9} /> Date Added
          </p>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            {new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      )}

      <div className="space-y-2 pt-1">
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noreferrer"
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium hover:bg-gray-800 transition-colors">
            <GitBranch size={13} /> View Source Code
          </a>
        )}
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noreferrer"
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-[#00A4EF] text-white text-xs font-medium hover:bg-blue-500 transition-colors">
            <Globe size={13} /> View Live Demo
          </a>
        )}
      </div>
    </div>
  </motion.div>
);

// ─── Sidebar ──────────────────────────────────────────────
const Sidebar = ({ activeCategory, setActiveCategory, setSelectedProject, filteredCount, onClose }) => (
  <motion.div
    initial={{ x: '-100%' }}
    animate={{ x: 0 }}
    exit={{ x: '-100%' }}
    transition={{ type: 'spring', damping: 28, stiffness: 280 }}
    className="
      /* Mobile: absolute overlay; sm+: static sidebar */
      absolute inset-y-0 left-0 z-30 w-48
      sm:static sm:z-auto sm:w-44
      border-r border-gray-200 dark:border-gray-700/50
      bg-gray-50 dark:bg-[#252525]
      flex flex-col py-2 overflow-y-auto shrink-0
      shadow-lg sm:shadow-none
    "
  >
    {/* Mobile close button */}
    <div className="flex items-center justify-between px-4 pb-2 sm:hidden">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest pt-2">Categories</p>
      <button onClick={onClose} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
        <X size={14} className="text-gray-500" />
      </button>
    </div>

    <p className="hidden sm:block text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-4 pt-2 pb-1">
      Categories
    </p>

    {CATEGORIES.map(cat => (
      <button
        key={cat}
        onClick={() => { setActiveCategory(cat); setSelectedProject(null); onClose(); }}
        className={`flex items-center gap-2 px-4 py-1.5 text-xs transition-colors rounded-sm mx-1 text-left
          ${activeCategory === cat
            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-white/5'}`}
      >
        <Folder
          size={13}
          strokeWidth={activeCategory === cat ? 2 : 1.5}
          className={activeCategory === cat ? 'text-[#00A4EF]' : ''}
        />
        {cat}
      </button>
    ))}

    <div className="mt-auto p-3 border-t border-gray-200 dark:border-gray-700/50">
      <div className="text-[10px] text-gray-400">
        {filteredCount} project{filteredCount !== 1 ? 's' : ''}
      </div>
    </div>
  </motion.div>
);

// ─── Main ProjectsApp ─────────────────────────────────────
const ProjectsApp = () => {
  const [activeCategory,   setActiveCategory]   = useState('All');
  const [activeSort,       setActiveSort]       = useState('newest');
  const [viewMode,         setViewMode]         = useState('grid');
  const [search,           setSearch]           = useState('');
  const [selectedProject,  setSelectedProject]  = useState(null);
  const [sidebarOpen,      setSidebarOpen]      = useState(false);

  const { data: projects = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['projects', activeCategory, activeSort],
    queryFn: () => fetchProjects({ category: activeCategory, sort: activeSort }),
  });

  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase()) ||
    p.techStack?.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex h-full text-sm overflow-hidden bg-white dark:bg-[#202020] relative">

      {/* ── Mobile sidebar backdrop ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="absolute inset-0 z-20 bg-black/40 sm:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar (always visible sm+, toggled on mobile) ── */}
      {/* Desktop: always rendered */}
      <div className="hidden sm:flex">
        <Sidebar
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          setSelectedProject={setSelectedProject}
          filteredCount={filtered.length}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Mobile: animated in/out */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="sm:hidden">
            <Sidebar
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              setSelectedProject={setSelectedProject}
              filteredCount={filtered.length}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        )}
      </AnimatePresence>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-2 sm:px-3 py-2 border-b border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-[#252525] shrink-0">

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="sm:hidden p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-300 shrink-0"
            aria-label="Toggle sidebar"
          >
            <Menu size={16} />
          </button>

          {/* View toggle */}
          <div className="flex rounded-md overflow-hidden border border-gray-200 dark:border-gray-600 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-[#2a2a2a] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'}`}
            >
              <LayoutGrid size={13} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 transition-colors ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-[#2a2a2a] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'}`}
            >
              <List size={13} />
            </button>
          </div>

          {/* Sort — hidden on very small screens */}
          <div className="relative hidden xs:block shrink-0">
            <select
              value={activeSort}
              onChange={e => setActiveSort(e.target.value)}
              className="appearance-none text-xs pl-2 pr-6 py-1.5 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-gray-700 dark:text-gray-300 focus:outline-none focus:border-blue-400 cursor-pointer"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={9} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
          </div>

          {/* Refresh */}
          <button
            onClick={() => refetch()}
            className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-gray-500 shrink-0"
            title="Refresh"
          >
            <RefreshCw size={12} />
          </button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Search */}
          <div className="relative shrink-0">
            <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search…"
              className="text-xs pl-7 pr-2 py-1.5 rounded-md border border-gray-200 dark:border-gray-600
                bg-white dark:bg-[#2a2a2a] text-gray-700 dark:text-gray-300
                placeholder:text-gray-400 focus:outline-none focus:border-blue-400
                w-28 sm:w-40 transition-all"
            />
          </div>
        </div>

        {/* Content + detail panel row */}
        <div className="flex flex-1 overflow-hidden relative">

          {/* Project grid / list */}
          <div className="flex-1 overflow-y-auto min-w-0">

            {/* Error state */}
            {isError && (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-500 px-4 text-center">
                <AlertTriangle size={38} className="text-amber-400" strokeWidth={1.5} />
                <p className="text-sm font-medium">Could not load projects</p>
                <p className="text-xs text-gray-400">check your internet connection</p>
                <button onClick={() => refetch()} className="flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-md bg-blue-500 text-white text-xs hover:bg-blue-600 transition-colors">
                  <RefreshCw size={11} /> Try Again
                </button>
              </div>
            )}

            {/* Grid */}
            {!isError && viewMode === 'grid' && (
              <div className="p-3 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3">
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                  : (
                    <AnimatePresence mode="popLayout">
                      {filtered.length === 0
                        ? (
                          <div key="empty" className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
                            <Folder size={44} strokeWidth={1} className="mb-3 opacity-40" />
                            <p className="text-sm">No projects found</p>
                          </div>
                        )
                        : filtered.map(p => <ProjectGridCard key={p._id} project={p} onClick={setSelectedProject} />)
                      }
                    </AnimatePresence>
                  )
                }
              </div>
            )}

            {/* List */}
            {!isError && viewMode === 'list' && (
              <div className="flex flex-col">
                <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-[#252525] text-[10px] font-semibold text-gray-500 uppercase tracking-wider shrink-0">
                  <span className="w-9 shrink-0" />
                  <span className="flex-1">Name</span>
                  <span className="hidden md:block w-36">Tech Stack</span>
                  <span className="w-12">Links</span>
                </div>
                {isLoading
                  ? Array.from({ length: 8 }).map((_, i) => <SkeletonList key={i} />)
                  : (
                    <AnimatePresence mode="popLayout">
                      {filtered.length === 0
                        ? (
                          <div key="empty" className="flex flex-col items-center justify-center py-16 text-gray-400">
                            <Folder size={44} strokeWidth={1} className="mb-3 opacity-40" />
                            <p className="text-sm">No projects found</p>
                          </div>
                        )
                        : filtered.map(p => <ProjectListRow key={p._id} project={p} onClick={setSelectedProject} />)
                      }
                    </AnimatePresence>
                  )
                }
              </div>
            )}
          </div>

          {/* Detail panel */}
          <AnimatePresence>
            {selectedProject && (
              <DetailPanel
                key={selectedProject._id}
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ProjectsApp;
