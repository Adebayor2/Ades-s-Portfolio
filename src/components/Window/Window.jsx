import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { Minus, Square, X } from 'lucide-react';
import * as Icons from 'lucide-react';
import AppLoader from '../Apps/AppLoader';

const TASKBAR_H = 48;

const Window = ({ windowState }) => {
  const {
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updateWindowPosition,
    activeWindow,
  } = useStore();

  const windowRef = useRef(null);
  const IconComponent = Icons[windowState.icon] || Icons.File;
  const isActive = activeWindow === windowState.id;

  // Live viewport dimensions for clamping
  const [vp, setVp] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobile = vp.w < 640;

  // ── Position/size — use style top/left so there's no transform stacking
  const posX = windowState.isMaximized ? 0 : windowState.position.x;
  const posY = windowState.isMaximized ? 0 : windowState.position.y;
  const winW = windowState.isMaximized ? '100vw' : windowState.size.width;
  const winH = windowState.isMaximized ? `calc(100vh - ${TASKBAR_H}px)` : windowState.size.height;

  // ── Drag
  const handleDragEnd = (_event, info) => {
    const rawX = windowState.position.x + info.offset.x;
    const rawY = windowState.position.y + info.offset.y;
    // Clamp: title bar must stay visible
    updateWindowPosition(windowState.id, {
      x: Math.max(0, Math.min(rawX, vp.w - 80)),
      y: Math.max(0, Math.min(rawY, vp.h - TASKBAR_H - 32)),
    });
  };

  if (windowState.isMinimized) return null;

  return (
    <motion.div
      ref={windowRef}
      onMouseDown={() => focusWindow(windowState.id)}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1, transition: { duration: 0.18 } }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.14 } }}
      className={`absolute flex flex-col rounded-xl overflow-hidden shadow-2xl border
        ${isActive ? 'border-gray-500/30 shadow-blue-500/10' : 'border-gray-500/20'}
        bg-white dark:bg-[#202020] text-black dark:text-white`}
      style={{
        zIndex: windowState.zIndex,
        left: posX,
        top: posY,
        width: winW,
        height: winH,
        // On mobile always fill the screen above the taskbar
        ...(isMobile && !windowState.isMaximized
          ? { left: 0, top: 0, width: '100vw', height: `calc(100vh - ${TASKBAR_H}px)` }
          : {}),
      }}
    >
      {/* ── Title Bar ── */}
      <div
        className={`h-8 flex justify-between items-center select-none shrink-0 border-b border-transparent
          ${isActive ? 'bg-gray-100 dark:bg-[#2d2d2d]' : 'bg-gray-50 dark:bg-[#1a1a1a] opacity-80'}`}
        onDoubleClick={() => maximizeWindow(windowState.id)}
      >
        {/* Drag handle + title */}
        <motion.div
          className="flex-1 flex items-center gap-2 px-3 h-full cursor-default min-w-0"
          drag={!windowState.isMaximized && !isMobile}
          dragMomentum={false}
          // dragConstraints forces the drag gesture to stay within these bounds
          // relative to the draggable element's starting position
          dragConstraints={{
            left:   -Math.max(0, windowState.position.x),
            right:  Math.max(0, vp.w - windowState.position.x - 120),
            top:    -Math.max(0, windowState.position.y),
            bottom: Math.max(0, vp.h - TASKBAR_H - windowState.position.y - 32),
          }}
          onDragEnd={handleDragEnd}
        >
          <IconComponent size={10} className="text-[#00A4EF] shrink-0" />
          <span className="text-xs font-medium truncate">{windowState.title}</span>
        </motion.div>

        {/* Window controls */}
        <div className="flex h-full shrink-0">
          {/* Hide minimize on mobile (no taskbar thumbnail) */}
          {!isMobile && (
            <button
              onClick={() => minimizeWindow(windowState.id)}
              className="w-[46px] h-full flex justify-center items-center hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <Minus size={14} />
            </button>
          )}
          {!isMobile && (
            <button
              onClick={() => maximizeWindow(windowState.id)}
              className="w-[46px] h-full flex justify-center items-center hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <Square size={12} />
            </button>
          )}
          <button
            onClick={() => closeWindow(windowState.id)}
            className="w-[46px] h-full flex justify-center items-center hover:bg-red-500 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-auto bg-white dark:bg-[#202020] relative min-h-0">
        <AppLoader componentName={windowState.component} />
      </div>
    </motion.div>
  );
};

export default Window;
