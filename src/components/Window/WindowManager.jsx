import { useStore } from '../../store/useStore';
import Window from './Window';
import { AnimatePresence } from 'framer-motion';

const WindowManager = () => {
  const { windows } = useStore();

  return (
    <>
      <AnimatePresence>
        {windows.map((windowState) => (
          <Window key={windowState.id} windowState={windowState} />
        ))}
      </AnimatePresence>
    </>
  );
};

export default WindowManager;
