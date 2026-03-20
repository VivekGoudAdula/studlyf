import React from 'react';
import { motion } from 'framer-motion';

const logos = [
  { name: 'JNTU', src: '/images/jntu.png' },
  { name: 'VJIM', src: '/images/vjim.png' },
  { name: 'CMR', src: '/images/cmr.png' },
  { name: 'IITM', src: '/images/iitm.png' },
  { name: 'Malla Reddy', src: '/images/mallareddyuni.png' },
  { name: 'Anurag', src: '/images/anuraguni.png' },
  { name: 'Aurora', src: '/images/aurorauni.png' },
  { name: 'Woxen', src: '/images/woxen.png' },
  { name: 'CBIT', src: '/images/cbit.png' },
];

const FeaturedColleges: React.FC = () => {
  // Duplicate logos for seamless loop
  const duplicatedLogos = [...logos, ...logos, ...logos]; // Increased for smoother loop with fewer logos

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-black text-[#111827] uppercase tracking-tighter"
          >
            FEATURED <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C4DFF] via-[#EC4899] to-[#FF5B5B]">COLLEGE</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 mt-4 text-lg font-medium"
          >
            Partnering with top-tier colleges to build your career success
          </motion.p>
        </div>

        <div className="relative flex items-center overflow-hidden group min-h-[150px] border-y border-transparent">
          <motion.div
            className="flex flex-nowrap min-w-max"
            animate={{
              x: ['0%', '-33.33%'],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 25,
                ease: 'linear',
              },
            }}
          >
            {duplicatedLogos.map((logo, index) => (
              <div
                key={index}
                className="flex items-center justify-center px-12 sm:px-20 min-w-[200px]"
              >
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="h-16 sm:h-20 w-auto object-contain opacity-100 block"
                />
              </div>
            ))}
          </motion.div>
          
          {/* Fading gradients for edges */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

export default FeaturedColleges;
