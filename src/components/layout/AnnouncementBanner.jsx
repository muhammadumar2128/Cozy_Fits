import React from 'react';
import { motion } from 'framer-motion';

const AnnouncementBanner = () => {
  const phrases = [
    "HANDCRAFTED IN PAKISTAN",
    "100% ORGANIC SILK",
    "GLOBAL SHIPPING"
  ];

  // Repeat the phrases array to ensure enough width for seamless looping
  const content = [...phrases, ...phrases, ...phrases, ...phrases];

  return (
    <div className="fixed top-0 left-0 w-full bg-[#151515] h-7 overflow-hidden relative flex items-center z-[60]">
      <motion.div
        className="flex items-center whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "linear",
        }}
      >
        {content.map((phrase, idx) => (
          <div key={idx} className="flex items-center">
            <span className="text-[9px] sm:text-[10px] tracking-[0.2em] text-[#d1d1d1] leading-none px-6 font-bold uppercase">
              {phrase}
            </span>
            <div className="w-1 h-1 rounded-full bg-yellow-500 shrink-0" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default AnnouncementBanner;
