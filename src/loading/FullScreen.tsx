// components/IntergalacticSpinner.tsx
'use client';

import { motion } from 'framer-motion';

export default function FullScreen() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-black via-indigo-900 to-black w-full">
      <div className="relative w-44 h-44" style={{ perspective: 1000 }}>
        {/* Glowing Core Planet */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-4 h-4 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 rounded-full shadow-[0_0_60px_10px_rgba(99,102,241,0.6)]"
          style={{ translateX: '-50%', translateY: '-50%' }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* First Orbit Ring */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full border border-blue-400/40 rounded-full"
          animate={{
            rotateX: [0, 360],
            rotateZ: [0, 360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ transformStyle: 'preserve-3d' }}
        />

        {/* Second Tilted Orbit Ring */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full border border-purple-400/30 rounded-full"
          animate={{
            rotateX: [0, 360],
            rotateZ: [45, 405],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ transformStyle: 'preserve-3d' }}
        />

        {/* Satellite Moon */}
        <motion.div
          className="absolute w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
          style={{ top: '10%', left: '50%', translateX: '-50%' }}
          animate={{
            rotate: 360,
            transformOrigin: '52px 52px',
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    </div>
  );
}
