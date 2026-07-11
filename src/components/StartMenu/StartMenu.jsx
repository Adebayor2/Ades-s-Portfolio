import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import * as Icons from 'lucide-react';

const StartMenu = () => {
  const { isStartMenuOpen, closeStartMenu, desktopIcons, openWindow } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showPowerMenu, setShowPowerMenu] = useState(false);
  const menuRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Don't close if clicking the taskbar start button (handled there)
      if (menuRef.current && !menuRef.current.contains(e.target) && !e.target.closest('#start-button')) {
        closeStartMenu();
      }
    };
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeStartMenu();
    };

    if (isStartMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isStartMenuOpen, closeStartMenu]);

  // Handle app click
  const handleAppClick = (appId) => {
    openWindow(appId);
  };

  // Filter apps
  const filteredApps = desktopIcons.filter(app => 
    app.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isStartMenuOpen && (
        <motion.div
          ref={menuRef}
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[600px] h-[700px] rounded-xl mica flex flex-col shadow-2xl z-[100] text-black dark:text-white border border-gray-300/30 dark:border-white/10"
        >
          {/* Search Bar */}
          <div className="p-6 pb-2">
            <div className="relative">
              <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search for apps, settings, and documents"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-11 pr-4 bg-white/60 dark:bg-[#1a1a1a]/60 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:border-blue-500 transition-colors placeholder:text-sm"
                autoFocus
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-4 custom-scrollbar">
            {/* Pinned Section */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-sm">Pinned</h3>
              <button className="text-xs bg-white/40 dark:bg-white/10 hover:bg-white/60 dark:hover:bg-white/20 px-2 py-1 rounded transition-colors shadow-sm">
                All apps &gt;
              </button>
            </div>
            
            <div className="grid grid-cols-6 gap-y-6 gap-x-2 mb-8">
              {filteredApps.map((app) => {
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
                const iconSrc = ICON_MAP[app.id];
                const IconComponent = Icons[app.icon] || Icons.File;
                return (
                  <div
                    key={app.id}
                    onClick={() => handleAppClick(app.id)}
                    className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-white/40 dark:hover:bg-white/10 transition-colors cursor-default group"
                  >
                    {iconSrc ? (
                      <img src={iconSrc} alt="" className="w-8 h-8 object-contain drop-shadow-sm transition-transform group-hover:scale-105" />
                    ) : (
                      <IconComponent className="w-8 h-8 text-[#00A4EF] drop-shadow-sm transition-transform group-hover:scale-105" strokeWidth={1.5} />
                    )}
                    <span className="text-[11px] text-center truncate w-full">{app.title}</span>
                  </div>
                );
              })}
            </div>

            {/* Recommended Section */}
            {!searchQuery && (
              <>
                <div className="flex justify-between items-center mb-4 mt-8">
                  <h3 className="font-semibold text-sm">Recommended</h3>
                  <button className="text-xs bg-white/40 dark:bg-white/10 hover:bg-white/60 dark:hover:bg-white/20 px-2 py-1 rounded transition-colors shadow-sm">
                    More &gt;
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-2 rounded-md hover:bg-white/40 dark:hover:bg-white/10 transition-colors cursor-default">
                    <Icons.FileText className="w-8 h-8 text-gray-500" />
                    <div className="flex flex-col">
                      <span className="text-[13px] font-medium">Welcome to my Portfolio!</span>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400">Recently opened</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-md hover:bg-white/40 dark:hover:bg-white/10 transition-colors cursor-default">
                    <Icons.Code className="w-8 h-8 text-[#00A4EF]" />
                    <div className="flex flex-col">
                      <span className="text-[13px] font-medium">Latest Project</span>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400">2 hours ago</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bottom Bar (Profile & Power) */}
          <div className="h-16 flex items-center justify-between px-8 bg-gray-100/50 dark:bg-[#1a1a1a]/80 border-t border-gray-300/30 dark:border-white/10 rounded-b-xl relative">
            {/* User Profile */}
            <div className="flex items-center gap-3 hover:bg-white/40 dark:hover:bg-white/10 p-2 rounded-md transition-colors cursor-default">
              <div className="w-8 h-8 rounded-full bg-[#00A4EF] flex items-center justify-center text-white font-semibold shadow-sm">
                ME
              </div>
              <span className="text-sm font-medium">Developer</span>
            </div>

            {/* Power Button */}
            <div className="relative">
              <button 
                onClick={() => setShowPowerMenu(!showPowerMenu)}
                className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-white/40 dark:hover:bg-white/10 transition-colors"
              >
                <Icons.Power className="w-5 h-5 text-gray-800 dark:text-gray-200" />
              </button>

              {/* Power Submenu */}
              <AnimatePresence>
                {showPowerMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute bottom-12 right-0 w-48 py-2 rounded-lg acrylic shadow-lg border border-gray-300/30 dark:border-white/10 z-[101]"
                  >
                    <div className="flex items-center gap-3 px-4 py-2 hover:bg-white/40 dark:hover:bg-white/10 cursor-default transition-colors">
                      <Icons.Moon className="w-4 h-4" />
                      <span className="text-sm">Sleep</span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 hover:bg-white/40 dark:hover:bg-white/10 cursor-default transition-colors">
                      <Icons.RefreshCw className="w-4 h-4" />
                      <span className="text-sm">Restart</span>
                    </div>
                    <div className="my-1 border-t border-gray-300/30 dark:border-gray-600/50" />
                    <div className="flex items-center gap-3 px-4 py-2 hover:bg-white/40 dark:hover:bg-white/10 cursor-default transition-colors text-blue-500">
                      <Icons.Info className="w-4 h-4" />
                      <span className="text-sm">About Portfolio</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StartMenu;
