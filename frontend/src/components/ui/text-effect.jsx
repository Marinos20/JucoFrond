'use client';
import React from 'react';
import { motion } from 'motion/react';

export function TextEffect({ children, per = 'word', as = 'p', className, delay = 0, speedSegment = 1 }) {
  // Découpe le texte par mot ou par ligne
  const segments = children.split(per === 'line' ? '\n' : /\s+/);

  // Détermine le tag à utiliser avec motion
  const MotionTag = motion[as] || motion.p;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: delay },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12, filter: 'blur(12px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring', bounce: 0.3, duration: 1.5 / speedSegment },
    },
  };

  return (
    <MotionTag
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
    >
      {segments.map((segment, i) => (
        <motion.span key={i} variants={itemVariants} className="inline-block whitespace-pre">
          {segment}
        </motion.span>
      ))}
    </MotionTag>
  );
}
