import React from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const SecurityShieldShowcase = () => {
  return (
    <div className="relative flex h-48 w-full items-center justify-center py-4 md:h-64 group select-none">
      {/* Background radial glow */}
      <motion.div
        animate={{
          opacity: [0.15, 0.3, 0.15],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-brand-primary)]/20 blur-[60px]"
      />

      <svg
        width="160"
        height="200"
        viewBox="0 0 150 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 transition-transform duration-500 group-hover:scale-105"
      >
        <defs>
          <linearGradient
            id="shieldGradient"
            x1="75"
            y1="10"
            x2="75"
            y2="170"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--color-brand-primary)" stopOpacity="0.15" />
            <stop
              offset="1"
              stopColor="var(--color-brand-primary)"
              stopOpacity="0.02"
            />
          </linearGradient>
        </defs>

        {/* Outer Shield Shell */}
        <motion.path
          d="M75 10L140 40V95C140 135 110 165 75 175C40 165 10 135 10 95V40L75 10Z"
          className="stroke-[var(--color-brand-primary)]/30"
          strokeWidth="3"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />

        {/* Inner Shield Body */}
        <motion.path
          d="M75 18L130 43V90C130 128 105 155 75 165C45 155 20 128 20 90V43L75 18Z"
          fill="url(#shieldGradient)"
          className="stroke-[var(--color-brand-primary)]/10"
          strokeWidth="1"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
        />

        {/* Lock Icon */}
        <motion.g
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.8, type: 'spring', damping: 12 }}
        >
          <path
            d="M75 60C66.7 60 60 66.7 60 75V85H90V75C90 66.7 83.3 60 75 60Z"
            stroke="var(--color-brand-primary)"
            strokeWidth="3"
            strokeLinecap="round"
            className="opacity-40"
          />
          <rect
            x="55"
            y="85"
            width="40"
            height="35"
            rx="4"
            fill="var(--color-brand-primary)"
            className="opacity-20"
          />
          <rect
            x="55"
            y="85"
            width="40"
            height="35"
            rx="4"
            stroke="var(--color-brand-primary)"
            strokeWidth="2.5"
            className="opacity-60"
          />
          <circle
            cx="75"
            cy="102"
            r="3.5"
            fill="var(--color-brand-primary)"
            className="animate-pulse"
          />
          <rect
            x="73.5"
            y="105"
            width="3"
            height="8"
            rx="1.5"
            fill="var(--color-brand-primary)"
          />
        </motion.g>
      </svg>

      {/* Floating tech debris / particles (subtle) */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px w-3 bg-[var(--color-brand-primary)]/20"
          initial={{
            x: Math.random() * 200 - 100,
            y: Math.random() * 100 - 50,
            rotate: Math.random() * 360,
            opacity: 0,
          }}
          animate={{
            x: [null, Math.random() * 40 - 20],
            y: [null, Math.random() * 40 - 20],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ left: '50%', top: '50%' }}
        />
      ))}

      {/* Integrity Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-0 flex items-center gap-2 rounded-full border border-[var(--color-brand-primary)]/20 bg-[var(--color-brand-primary)]/5 px-3 py-1 backdrop-blur-sm"
      >
        <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand-primary)] animate-pulse" />
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-brand-primary)]/80">
          Encrypted
        </span>
      </motion.div>
    </div>
  );
};

export default SecurityShieldShowcase;
