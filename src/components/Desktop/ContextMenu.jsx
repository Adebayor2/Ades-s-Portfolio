import { motion } from 'framer-motion';
import { RefreshCw, LayoutGrid, Monitor, LayoutTemplate } from 'lucide-react';

const ContextMenu = ({ x, y }) => {
  // Ensure menu stays within screen bounds
  const menuWidth = 240;
  const menuHeight = 200;
  const safeX = x + menuWidth > window.innerWidth ? window.innerWidth - menuWidth - 10 : x;
  const safeY = y + menuHeight > window.innerHeight ? window.innerHeight - menuHeight - 10 : y;

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.1 }}
      className="fixed z-[9999] w-60 py-2 rounded-lg acrylic text-sm text-gray-800 dark:text-gray-200"
      style={{ left: safeX, top: safeY }}
      onContextMenu={(e) => e.preventDefault()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-1">
        <ContextMenuItem icon={<LayoutGrid size={16} />} label="View" hasSubmenu />
        <ContextMenuItem icon={<LayoutTemplate size={16} />} label="Sort by" hasSubmenu />
        <ContextMenuItem icon={<RefreshCw size={16} />} label="Refresh" onClick={handleRefresh} />
        
        <div className="my-1 border-t border-gray-300 dark:border-gray-600/50" />
        
        <ContextMenuItem label="New" hasSubmenu />
        
        <div className="my-1 border-t border-gray-300 dark:border-gray-600/50" />
        
        <ContextMenuItem icon={<Monitor size={16} />} label="Display settings" />
        <ContextMenuItem label="Personalize" />
      </div>
    </motion.div>
  );
};

const ContextMenuItem = ({ icon, label, onClick, hasSubmenu }) => {
  return (
    <div 
      className="flex items-center justify-between px-3 py-1.5 hover:bg-white/40 dark:hover:bg-white/10 rounded-md cursor-default group"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <span className="w-4 h-4 flex justify-center items-center opacity-70 group-hover:opacity-100">
          {icon}
        </span>
        <span>{label}</span>
      </div>
      {hasSubmenu && (
        <span className="text-xs opacity-50">▶</span>
      )}
    </div>
  );
};

export default ContextMenu;

