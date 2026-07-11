import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Monitor, Server, Cloud, Wrench } from 'lucide-react';

const SKILLS = [
  {
    id: 'frontend',
    label: 'Frontend',
    icon: Monitor,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-700/40',
    bar: 'bg-blue-500',
    skills: [
      { name: 'React', level: 90 },
      { name: 'TypeScript', level: 75 },
      { name: 'JavaScript', level: 95 },
      { name: 'Tailwind CSS', level: 90 },
      { name: 'Framer Motion', level: 80 },
      { name: 'Next.js', level: 70 },
      { name: 'HTML / CSS', level: 95 },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    icon: Server,
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-700/40',
    bar: 'bg-green-500',
    skills: [
      { name: 'Node.js', level: 85 },
      { name: 'Express.js', level: 88 },
      { name: 'MongoDB', level: 80 },
      { name: 'REST APIs', level: 90 },
      { name: 'PostgreSQL', level: 65 },
      { name: 'GraphQL', level: 55 },
    ],
  },
  {
    id: 'devops',
    label: 'DevOps & Cloud',
    icon: Cloud,
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-200 dark:border-purple-700/40',
    bar: 'bg-purple-500',
    skills: [
      { name: 'Git & GitHub', level: 90 },
      { name: 'Docker', level: 65 },
      { name: 'Linux CLI', level: 75 },
      { name: 'Vercel / Netlify', level: 85 },
      { name: 'AWS (basics)', level: 50 },
    ],
  },
  {
    id: 'tools',
    label: 'Tools & Other',
    icon: Wrench,
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-700/40',
    bar: 'bg-amber-500',
    skills: [
      { name: 'VS Code', level: 95 },
      { name: 'Figma', level: 70 },
      { name: 'Postman', level: 85 },
      { name: 'Zustand / Redux', level: 80 },
      { name: 'React Query', level: 75 },
    ],
  },
];

// ─── Skill Row with animated bar ──────────────────────────
const SkillRow = ({ name, level, bar, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05, type: 'spring', damping: 20 }}
    className="flex items-center gap-3"
  >
    <span className="text-xs text-gray-600 dark:text-gray-300 w-32 shrink-0 truncate">{name}</span>
    <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${bar}`}
        initial={{ width: 0 }}
        animate={{ width: `${level}%` }}
        transition={{ duration: 0.8, delay: index * 0.05, ease: 'easeOut' }}
      />
    </div>
    <span className="text-[10px] font-medium text-gray-400 w-8 text-right">{level}%</span>
  </motion.div>
);

// ─── Accordion Category ───────────────────────────────────
const SkillCategory = ({ category }) => {
  const [open, setOpen] = useState(true);
  const Icon = category.icon;

  return (
    <div className={`rounded-xl border ${category.border} overflow-hidden`}>
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${category.bg} hover:brightness-95`}
      >
        <Icon size={16} className={category.color} />
        <span className="flex-1 text-sm font-semibold text-gray-700 dark:text-gray-200">{category.label}</span>
        <span className="text-xs text-gray-400">{category.skills.length} skills</span>
        <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronRight size={14} className="text-gray-400" />
        </motion.span>
      </button>

      {/* Skill rows */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4 space-y-3 bg-white dark:bg-[#2a2a2a]">
              {category.skills.map((skill, i) => (
                <SkillRow key={skill.name} name={skill.name} level={skill.level} bar={category.bar} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main SkillsApp ───────────────────────────────────────
const SkillsApp = () => {
  const totalSkills = SKILLS.reduce((sum, cat) => sum + cat.skills.length, 0);
  const avgLevel = Math.round(
    SKILLS.flatMap(c => c.skills).reduce((s, sk) => s + sk.level, 0) / totalSkills
  );

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-[#1e1e1e]">
      {/* Header — Device Manager style */}
      <div className="sticky top-0 z-10 bg-gray-100 dark:bg-[#252525] border-b border-gray-200 dark:border-gray-700/50 px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold text-gray-800 dark:text-white">Skills & Proficiency</h1>
          <p className="text-xs text-gray-400">{totalSkills} skills across {SKILLS.length} categories · Avg. {avgLevel}% proficiency</p>
        </div>
        <div className="flex gap-2">
          {SKILLS.map(cat => (
            <div key={cat.id} className={`w-3 h-3 rounded-full ${cat.bar}`} title={cat.label} />
          ))}
        </div>
      </div>

      <div className="p-6 space-y-4 max-w-2xl mx-auto">
        {SKILLS.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <SkillCategory category={cat} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SkillsApp;
