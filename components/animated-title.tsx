'use client';

import { motion } from 'framer-motion';

export default function AnimatedTitle() {
  return (
    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent leading-[1.1] lg:max-w-[120%]">
      One simple link for
      <br />
      your{" "}
      <motion.span
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        className="relative inline-block"
      >
        <motion.span
          initial={{ width: 0 }}
          animate={{
            width: ["0%", "100%", "100%", "0%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 4,
            ease: "easeInOut",
          }}
          className="absolute whitespace-nowrap overflow-hidden"
        >
          hotel
        </motion.span>
        <motion.span
          initial={{ width: 0 }}
          animate={{
            width: ["0%", "100%", "100%", "0%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 4,
            delay: 2,
            ease: "easeInOut",
          }}
          className="absolute whitespace-nowrap overflow-hidden"
        >
          home
        </motion.span>
        <motion.span
          initial={{ width: 0 }}
          animate={{
            width: ["0%", "100%", "100%", "0%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 4,
            delay: 4,
            ease: "easeInOut", 
          }}
          className="absolute whitespace-nowrap overflow-hidden"
        >
          apartment
        </motion.span>
        <span className="invisible">apartment</span>
      </motion.span>
    </h1>
  );
} 