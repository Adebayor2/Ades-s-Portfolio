import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { GitBranch, Link2, Code2, Coffee, Briefcase, MapPin, Mail, ExternalLink, User } from 'lucide-react';
import { fetchProfile } from '../../api/profile';

const FALLBACK_PROFILE = {
  name: 'Adeniran Adebayo',
  title: 'Full Stack Developer',
  bio: `I'm a passionate Full Stack Developer who loves building elegant, performant web applications that solve real problems. I specialize in the JavaScript ecosystem: React on the frontend, Node.js and Express on the backend, and MongoDB for data.`,
  avatarUrl: '',
  githubUrl: 'https://github.com/Adebayo2',
  linkedinUrl: 'https://linkedin.com',
  email: 'adeniranadebayo27@gmail.com',
};

const STATS = [
  { icon: Code2, label: 'Years Coding', value: '2+', color: 'text-blue-500' },
  { icon: Briefcase, label: 'Projects Built', value: '20+', color: 'text-purple-500' },
  { icon: Coffee, label: 'Cups of Coffee', value: '8', color: 'text-amber-500' },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20, stiffness: 200 } },
};

const getProfileValue = (profile, key) => profile?.[key] || FALLBACK_PROFILE[key];

const AboutApp = () => {
  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });

  const name = getProfileValue(profile, 'name');
  const title = getProfileValue(profile, 'title');
  const bio = getProfileValue(profile, 'bio');
  const avatarUrl = getProfileValue(profile, 'avatarUrl');
  const email = getProfileValue(profile, 'email');
  const githubUrl = getProfileValue(profile, 'githubUrl');
  const linkedinUrl = getProfileValue(profile, 'linkedinUrl');

  const links = [
    githubUrl && { icon: GitBranch, label: 'GitHub', href: githubUrl, color: 'hover:bg-gray-800 bg-gray-900 text-white' },
    linkedinUrl && { icon: Link2, label: 'LinkedIn', href: linkedinUrl, color: 'hover:bg-blue-700 bg-blue-600 text-white' },
    email && { icon: Mail, label: 'Email', href: `mailto:${email}`, color: 'hover:bg-red-600 bg-red-500 text-white' },
  ].filter(Boolean);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="h-full overflow-y-auto bg-gray-50 dark:bg-[#1e1e1e] text-gray-800 dark:text-gray-200"
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0078d4] via-[#005a9e] to-[#003a6e] px-8 py-10">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 40px,rgba(255,255,255,.3) 40px,rgba(255,255,255,.3) 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(255,255,255,.3) 40px,rgba(255,255,255,.3) 41px)' }}
        />

        <div className="relative flex items-center gap-6">
          <motion.div
            variants={item}
            className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center overflow-hidden text-white shadow-2xl shrink-0"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <User size={42} strokeWidth={1.6} />
            )}
          </motion.div>

          <div className="min-w-0">
            <motion.h1 variants={item} className="text-2xl font-bold text-white tracking-tight truncate">{name}</motion.h1>
            <motion.p variants={item} className="text-blue-200 font-medium mt-0.5">{title}</motion.p>
            <motion.div variants={item} className="flex items-center gap-1 mt-1 text-blue-200 text-xs">
              <MapPin size={11} /> Lagos, Nigeria / Available for Work
              <span className="ml-1 w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 max-w-2xl space-y-8">
        {(isLoading || isError) && (
          <motion.div variants={item} className="text-xs text-gray-400">
            {isLoading ? 'Loading profile...' : 'Using saved fallback profile while the backend is unavailable.'}
          </motion.div>
        )}

        <motion.section variants={item}>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">About</h2>
          <div className="bg-white dark:bg-[#2a2a2a] rounded-xl p-5 border border-gray-200 dark:border-gray-700/50 shadow-sm">
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{bio}</p>
          </div>
        </motion.section>

        <motion.section variants={item}>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Stats</h2>
          <div className="grid grid-cols-3 gap-3">
            {STATS.map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-white dark:bg-[#2a2a2a] rounded-xl p-4 border border-gray-200 dark:border-gray-700/50 shadow-sm flex flex-col items-center gap-2 text-center">
                <Icon size={22} className={color} />
                <span className="text-2xl font-bold text-gray-800 dark:text-white">{value}</span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section variants={item}>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">System Specs</h2>
          <div className="bg-white dark:bg-[#2a2a2a] rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-gray-700/40">
            {[
              { label: 'Name', value: name },
              { label: 'Role', value: title },
              { label: 'Email', value: email },
              { label: 'Primary Stack', value: 'React / Node.js / MongoDB / Express' },
              { label: 'Open to', value: 'Freelance / Full-time / Collaboration' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start gap-4 px-5 py-3">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-36 shrink-0 mt-0.5">{label}</span>
                <span className="text-xs text-gray-700 dark:text-gray-300 break-words min-w-0">{value}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {links.length > 0 && (
          <motion.section variants={item}>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Connect</h2>
            <div className="flex flex-wrap gap-3">
              {links.map(({ icon: Icon, label, href, color }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${color} shadow-sm`}>
                  <Icon size={13} /> {label} <ExternalLink size={10} className="opacity-60" />
                </a>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </motion.div>
  );
};

export default AboutApp;

