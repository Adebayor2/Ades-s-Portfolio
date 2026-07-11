import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import * as Icons from 'lucide-react';

const ICON_MAP = {
  projects: 'https://img.icons8.com/fluency/96/folder-invoices.png',
  about: 'https://img.icons8.com/fluency/96/user-male-circle.png',
  skills: 'https://img.icons8.com/fluency/96/source-code.png',
  contact: 'https://img.icons8.com/fluency/96/mail.png',
  terminal: 'https://img.icons8.com/fluency/96/console.png',
  resume: 'https://img.icons8.com/fluency/96/resume.png',
  settings: 'https://img.icons8.com/fluency/96/settings.png',
  github: 'https://img.icons8.com/fluency/96/github.png',
};

const DesktopIcon = ({ icon }) => {
  const { openWindow } = useStore();
  
  const iconSrc = ICON_MAP[icon.id];
  const IconComponent = Icons[icon.icon] || Icons.File;

  const handleClick = (e) => {
    e.stopPropagation();
    openWindow(icon.id);
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      onClick={handleClick}
      className="w-[72px] h-[72px] flex flex-col items-center justify-center p-1 rounded-sm hover:bg-white/20 active:bg-white/30 cursor-default transition-colors group relative"
    >
      {iconSrc ? (
        <img src={iconSrc} alt="" className="w-10 h-10 object-contain drop-shadow-md mb-1 transition-transform group-hover:scale-105" />
      ) : (
        <IconComponent className="w-10 h-10 text-[#00A4EF] drop-shadow-md mb-1" strokeWidth={1.5} />
      )}
      <span className="text-white text-[11px] text-center leading-tight drop-shadow-md select-none px-1 rounded-sm group-hover:bg-blue-600/60">
        {icon.title}
      </span>
    </motion.div>
  );
};

export default DesktopIcon;
