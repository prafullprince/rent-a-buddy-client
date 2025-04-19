// components/PlanetSpinner.tsx
'use client';

import { motion } from 'framer-motion';

export default function PlanetSpinner() {
  return (
    <div className="flex items-center justify-center bg-black">
      <div className="relative w-6 h-6">
        {/* Glowing Planet Core */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_20px_5px_rgba(59,130,246,0.6)]"
          style={{ translateX: '-50%', translateY: '-50%' }}
          animate={{
            scale: [1, 1.1, 1],
            boxShadow: [
              '0 0 20px 5px rgba(59,130,246,0.6)',
              '0 0 30px 8px rgba(59,130,246,0.8)',
              '0 0 20px 5px rgba(59,130,246,0.6)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Orbit Ring */}
        <motion.div
          className="absolute w-full h-full border border-blue-500/40 rounded-full"
          animate={{
            rotateX: [0, 360],
            rotateZ: [0, 360],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: 'linear',
          }}
          style={{
            transformStyle: 'preserve-3d',
            perspective: 1000,
          }}
        />

        {/* Orbiting Satellite */}
        <motion.div
          className="absolute top-0 left-1/2 w-2 h-2 bg-white rounded-full shadow-md"
          style={{ translateX: '-50%' }}
          animate={{
            rotate: 360,
            transformOrigin: '2px 4px',
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: 'linear',
          }}
        />
      </div>
    </div>
  );
}
