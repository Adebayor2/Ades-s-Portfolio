import { useEffect } from 'react';
import { motion } from 'framer-motion';

const BootScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000); // 2 seconds boot time
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50 cursor-none"
    >
      {/* Windows 11 Logo */}
      <motion.div 
        className="grid grid-cols-2 gap-1 mb-24"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="w-24 h-24 bg-[#00A4EF]" />
        <div className="w-24 h-24 bg-[#00A4EF]" />
        <div className="w-24 h-24 bg-[#00A4EF]" />
        <div className="w-24 h-24 bg-[#00A4EF]" />
      </motion.div>

      {/* Spinning Dots Loader */}
      <div className="relative w-12 h-12 flex justify-center items-center">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            animate={{
              rotate: 360,
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.15,
            }}
            style={{
              transformOrigin: '50% 24px',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default BootScreen;
