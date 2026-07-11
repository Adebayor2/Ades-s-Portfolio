import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useStore } from './store/useStore';
import BootScreen from './components/BootScreen/BootScreen';
import LockScreen from './components/LockScreen/LockScreen';
import Desktop from './components/Desktop/Desktop';

function DesktopApp() {
  const { systemState, setSystemState } = useStore();

  useEffect(() => {
    // Disable default right-click context menu globally
    const handleContextMenu = (e) => e.preventDefault();
    window.addEventListener('contextmenu', handleContextMenu);
    return () => window.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-black relative">
      <AnimatePresence mode="wait">
        {systemState === 'booting' && (
          <BootScreen key="boot" onComplete={() => setSystemState('locked')} />
        )}
        {systemState === 'locked' && (
          <LockScreen key="lock" onUnlock={() => setSystemState('desktop')} />
        )}
        {systemState === 'desktop' && (
          <Desktop key="desktop" />
        )}
      </AnimatePresence>
    </div>
  );
}

export default DesktopApp;

