import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LockScreen = ({ onUnlock }) => {
  const [time, setTime] = useState(new Date());
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleInteraction = () => {
    setShowLogin(true);
  };

  const handleSignIn = () => {
    onUnlock();
  };


  const bgImage = "https://images.unsplash.com/photo-1617042375876-a13e36732a04?q=80&w=2564&auto=format&fit=crop";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="absolute inset-0 z-40 select-none overflow-hidden"
      onClick={handleInteraction}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleInteraction(); }}
      tabIndex={0}
      autoFocus
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out"
        style={{ 
          backgroundImage: `url('${bgImage}')`,
          filter: showLogin ? 'blur(20px)' : 'blur(0px)',
          transform: showLogin ? 'scale(1.05)' : 'scale(1)'
        }}
      />
      <div className="absolute inset-0 bg-black/20" />


      <AnimatePresence>
        {!showLogin && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute top-[10%] left-0 right-0 flex flex-col items-center text-white"
          >
            <h1 className="text-[6rem] font-semibold tracking-tight leading-none drop-shadow-md">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
            </h1>
            <p className="text-2xl font-medium mt-4 drop-shadow-md">
              {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Form (Fades in on click) */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-white"
          >
            <div className="w-48 h-48 rounded-full bg-white/20 mb-6 flex items-center justify-center backdrop-blur-md border border-white/30 overflow-hidden shadow-2xl">
              <svg className="w-24 h-24 text-white/80" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-3xl font-semibold mb-6">Guest User</h2>
            <button
              onClick={(e) => { e.stopPropagation(); handleSignIn(); }}
              className="px-10 py-2 rounded-md acrylic hover:bg-white/30 transition-colors text-white font-medium border border-white/40 shadow-lg"
            >
              Sign In
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LockScreen;
