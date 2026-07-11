import { useState, useRef } from 'react';
import { useStore } from '../../store/useStore';
import DesktopIcon from './DesktopIcon';
import ContextMenu from './ContextMenu';
import WindowManager from '../Window/WindowManager';
import Taskbar from '../Taskbar/Taskbar';
import StartMenu from '../StartMenu/StartMenu';

const Desktop = () => {
  const { desktopIcons, wallpaper } = useStore();
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0 });
  const desktopRef = useRef(null);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.pageX,
      y: e.pageY,
    });
  };

  const handleClick = () => {
    if (contextMenu.show) setContextMenu({ ...contextMenu, show: false });
  };

  return (
    <div 
      className="absolute inset-0 overflow-hidden"
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      ref={desktopRef}
    >
      {/* Wallpaper */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-500 ease-in-out"
        style={{ backgroundImage: `url('${wallpaper}')` }}
      />
      
      {/* Desktop Icons Grid container */}
      <div className="absolute inset-0 p-2 flex flex-col flex-wrap gap-2 content-start z-10 h-[calc(100vh-48px)]">
        {desktopIcons.map((icon) => (
          <DesktopIcon key={icon.id} icon={icon} />
        ))}
      </div>

      {/* Context Menu */}
      {contextMenu.show && (
        <ContextMenu x={contextMenu.x} y={contextMenu.y} closeMenu={handleClick} />
      )}

      {/* Windows Layer */}
      <WindowManager />

      {/* Start Menu Layer */}
      <StartMenu />

      {/* Taskbar Layer */}
      <Taskbar />
    </div>
  );
};

export default Desktop;

