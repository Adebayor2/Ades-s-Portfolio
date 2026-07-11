import { create } from 'zustand';

export const useStore = create((set, get) => ({
  systemState: 'booting',
  setSystemState: (state) => set({ systemState: state }),


  wallpaper: localStorage.getItem('portfolio_wallpaper') || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
  setWallpaper: (url) => {
    localStorage.setItem('portfolio_wallpaper', url);
    set({ wallpaper: url });
  },

  
  desktopIcons: [
    { id: 'projects', title: 'Projects', icon: 'Folder', component: 'ProjectsApp' },
    { id: 'about', title: 'About Me', icon: 'User', component: 'AboutApp' },
    { id: 'skills', title: 'Skills', icon: 'Code', component: 'SkillsApp' },
    { id: 'contact', title: 'Contact', icon: 'Mail', component: 'ContactApp' },
    { id: 'terminal', title: 'Terminal', icon: 'Terminal', component: 'TerminalApp' },
    { id: 'github', title: 'GitHub', icon: 'Github', action: 'url', url: 'https://github.com/Adebayor2' },
    { id: 'resume', title: 'Resume', icon: 'FileText', action: 'download', url: '/resume.pdf' },
    { id: 'settings', title: 'Settings', icon: 'Settings', component: 'SettingsApp' },
  ],

  
  taskbarApps: [
    { id: 'projects', title: 'Projects', icon: 'Folder' },
    { id: 'terminal', title: 'Terminal', icon: 'Terminal' },
  ],

  
  windows: [],
  activeWindow: null,
  highestZIndex: 10,
  
  // Start Menu State
  isStartMenuOpen: false,
  toggleStartMenu: () => set((state) => ({ isStartMenuOpen: !state.isStartMenuOpen })),
  closeStartMenu: () => set({ isStartMenuOpen: false }),

  // Actions
  openWindow: (appId) => {
    get().closeStartMenu();
    const { windows, desktopIcons, highestZIndex } = get();
    const existingWindow = windows.find((w) => w.id === appId);

    if (existingWindow) {
      if (existingWindow.isMinimized) {
        set((state) => ({
          windows: state.windows.map(w => w.id === appId ? { ...w, isMinimized: false, zIndex: highestZIndex + 1 } : w),
          activeWindow: appId,
          highestZIndex: highestZIndex + 1,
        }));
      } else {
        set({ activeWindow: appId });
        get().focusWindow(appId);
      }
      return;
    }

    const appData = desktopIcons.find(icon => icon.id === appId);
    if (!appData) return;

    if (appData.action === 'url') {
      window.open(appData.url, '_blank');
      return;
    }
    
    if (appData.action === 'download') {
      window.open(appData.url, '_blank');
      return;
    }

    const TASKBAR_HEIGHT = 38; 
    const isMobile = window.innerWidth < 640;

    const sizeMap = {
      TerminalApp: { width: 720, height: 480 },
      ProjectsApp: { width: 860, height: 560 },
      AboutApp:    { width: 640, height: 520 },
      SkillsApp:   { width: 560, height: 500 },
      ContactApp:  { width: 660, height: 460 },
    };
    const preferredSize = sizeMap[appData.component] || { width: 640, height: 480 };


    const maxW = window.innerWidth  - 16;
    const maxH = window.innerHeight - TASKBAR_HEIGHT - 8;
    const size = {
      width:  Math.min(preferredSize.width,  maxW),
      height: Math.min(preferredSize.height, maxH),
    };

    // Center and clamp: y must be >= 0 so title bar never hides above the top
    const rawX = window.innerWidth  / 2 - size.width  / 2;
    const rawY = window.innerHeight / 2 - size.height / 2;
    const position = {
      x: Math.max(0, rawX),
      y: Math.max(0, rawY),
    };

    const newWindow = {
      id: appData.id,
      title: appData.title,
      icon: appData.icon,
      component: appData.component,
      isOpen: true,
      isMinimized: false,
      isMaximized: isMobile, // auto-maximize on small screens
      zIndex: highestZIndex + 1,
      position,
      size,
    };

    set((state) => ({
      windows: [...state.windows, newWindow],
      activeWindow: appId,
      highestZIndex: state.highestZIndex + 1,
    }));
  },

  closeWindow: (appId) => {
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== appId),
      activeWindow: state.activeWindow === appId ? null : state.activeWindow,
    }));
  },

  minimizeWindow: (appId) => {
    set((state) => ({
      windows: state.windows.map((w) => w.id === appId ? { ...w, isMinimized: true } : w),
      activeWindow: state.activeWindow === appId ? null : state.activeWindow,
    }));
  },

  maximizeWindow: (appId) => {
    set((state) => ({
      windows: state.windows.map((w) => w.id === appId ? { ...w, isMaximized: !w.isMaximized } : w),
    }));
  },

  focusWindow: (appId) => {
    const { highestZIndex, activeWindow } = get();
    if (activeWindow === appId) return;

    set((state) => ({
      windows: state.windows.map((w) => w.id === appId ? { ...w, zIndex: highestZIndex + 1 } : w),
      activeWindow: appId,
      highestZIndex: highestZIndex + 1,
    }));
  },

  updateWindowPosition: (appId, position) => {
    const TASKBAR_HEIGHT = 48;
    // Clamp so the title bar can never be dragged fully off-screen
    const clampedPosition = {
      x: Math.max(0, Math.min(position.x, window.innerWidth  - 80)),
      y: Math.max(0, Math.min(position.y, window.innerHeight - TASKBAR_HEIGHT - 32)),
    };
    set((state) => ({
      windows: state.windows.map((w) => w.id === appId ? { ...w, position: clampedPosition, isMaximized: false } : w),
    }));
  },

  updateWindowSize: (appId, size) => {
    set((state) => ({
      windows: state.windows.map((w) => w.id === appId ? { ...w, size } : w),
    }));
  },
}));
