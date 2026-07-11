import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import * as Icons from 'lucide-react';

// ─── Windows 11-style logo ─────────────────────────────────
const Windows11Logo = () => (
  <svg viewBox="0 0 120 120" className="w-[18px] h-[18px] drop-shadow-sm shrink-0">
    <rect x="4"  y="4"  width="52" height="52" fill="#00A4EF" rx="3" />
    <rect x="64" y="4"  width="52" height="52" fill="#00A4EF" rx="3" />
    <rect x="4"  y="64" width="52" height="52" fill="#00A4EF" rx="3" />
    <rect x="64" y="64" width="52" height="52" fill="#00A4EF" rx="3" />
  </svg>
);

// ─── Fluency icon map ──────────────────────────────────────
const ICON_MAP = {
  projects: 'https://img.icons8.com/fluency/96/folder-invoices.png',
  about:    'https://img.icons8.com/fluency/96/user-male-circle.png',
  skills:   'https://img.icons8.com/fluency/96/source-code.png',
  contact:  'https://img.icons8.com/fluency/96/mail.png',
  terminal: 'https://img.icons8.com/fluency/96/console.png',
  resume:   'https://img.icons8.com/fluency/96/resume.png',
  settings: 'https://img.icons8.com/fluency/96/settings.png',
  github:   'https://img.icons8.com/fluency/96/github.png',
};

// ─── System Tray ──────────────────────────────────────────
const SystemTray = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex items-center gap-1 h-full text-black dark:text-white shrink-0">
      {/* System icons — hidden on very small screens */}
      <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/20 transition-colors cursor-default">
        <Icons.Wifi      size={13} />
        <Icons.Volume2   size={13} />
        <Icons.Battery   size={13} />
      </div>

      {/* Clock — always visible */}
      <div className="flex flex-col items-end justify-center px-2 py-1 rounded-md hover:bg-white/20 transition-colors cursor-default leading-none">
        <span className="text-[11px] font-medium tabular-nums">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        <span className="text-[9px] text-black/60 dark:text-white/60 tabular-nums hidden sm:block">
          {time.toLocaleDateString([], { month: 'short', day: 'numeric', year: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

// ─── App Icon Button ──────────────────────────────────────
const AppIconBtn = ({ app, isOpen, isActive, isMinimized, onClick }) => {
  const iconSrc       = ICON_MAP[app.id];
  const IconComponent = Icons[app.icon] || Icons.File;

  return (
    <div
      onClick={onClick}
      title={app.title}
      className={`relative w-10 h-10 rounded-md flex items-center justify-center
        transition-all duration-100 cursor-default group shrink-0
        ${isActive && !isMinimized
          ? 'bg-white/25 dark:bg-white/12'
          : 'hover:bg-white/15 dark:hover:bg-white/8'}
        active:scale-90`}
    >
      {iconSrc ? (
        <img
          src={iconSrc}
          alt={app.title}
          className="w-[22px] h-[22px] object-contain drop-shadow-sm
            transition-transform group-hover:-translate-y-0.5"
        />
      ) : (
        <IconComponent
          size={20}
          className="text-[#00A4EF] drop-shadow-sm transition-transform group-hover:-translate-y-0.5"
          strokeWidth={1.5}
        />
      )}

      {/* Open indicator dot */}
      {isOpen && (
        <span
          className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 rounded-full transition-all duration-300
            ${isActive && !isMinimized
              ? 'w-4 h-[3px] bg-blue-400'
              : 'w-1.5 h-[3px] bg-gray-400 dark:bg-gray-500'}`}
        />
      )}
    </div>
  );
};

// ─── Main Taskbar ─────────────────────────────────────────
const Taskbar = () => {
  const {
    taskbarApps, windows, activeWindow,
    openWindow, minimizeWindow,
    toggleStartMenu, isStartMenuOpen,
  } = useStore();

  // Build the icon list: pinned apps + any unpinned open windows
  const allTaskbarIcons = [...taskbarApps];
  windows.forEach(w => {
    if (!taskbarApps.find(a => a.id === w.id)) {
      allTaskbarIcons.push({ id: w.id, title: w.title, icon: w.icon });
    }
  });
  const openAppIds = windows.map(w => w.id);

  const handleAppClick = (appId) => {
    const win = windows.find(w => w.id === appId);
    if (win) {
      win.id === activeWindow && !win.isMinimized
        ? minimizeWindow(appId)
        : openWindow(appId);
    } else {
      openWindow(appId);
    }
  };

  return (
    <div
      className="
        absolute bottom-0 left-0 right-0 z-50
        h-12
        acrylic
        shadow-[0_-1px_12px_rgba(0,0,0,0.25)]
        flex items-center
        px-2
        /* Prevent any child from pushing height > 48 px */
        overflow-hidden
      "
    >
      {/* ── Left spacer (desktop only) ── */}
      <div className="hidden sm:block w-[80px] shrink-0" />

      {/* ── Centre: start + app icons ── */}
      <div className="flex-1 flex items-center justify-center gap-0.5 overflow-x-auto scrollbar-none">
        {/* Start button */}
        <div
          id="start-button"
          onClick={toggleStartMenu}
          className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0
            transition-all duration-100 cursor-default
            ${isStartMenuOpen
              ? 'bg-white/25 dark:bg-white/12 shadow-inner'
              : 'hover:bg-white/15 dark:hover:bg-white/8 active:scale-90'}`}
        >
          <Windows11Logo />
        </div>

        {/* Thin separator */}
        <span className="w-px h-5 bg-white/20 dark:bg-white/10 mx-1 shrink-0 hidden sm:block" />

        {/* App icons */}
        {allTaskbarIcons.map(app => {
          const win = windows.find(w => w.id === app.id);
          return (
            <AppIconBtn
              key={app.id}
              app={app}
              isOpen={openAppIds.includes(app.id)}
              isActive={activeWindow === app.id}
              isMinimized={win?.isMinimized}
              onClick={() => handleAppClick(app.id)}
            />
          );
        })}
      </div>

      {/* ── Right: system tray ── */}
      <SystemTray />
    </div>
  );
};

export default Taskbar;
