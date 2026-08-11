"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export const HeroSection = () => {
  const statItems = [
    { value: "10k", label: "ACTIVE JOBS", customIndex: 2 },
    { value: "500", label: "TOP COMPANIES", customIndex: 3 },
    { value: "98%", label: "PLACEMENT RATE", customIndex: 4 },
  ];

  // Framer Motion Variants
  const fadeDownVariants = {
    initial: { opacity: 0, y: -20 },
    animate: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    }),
  };

  const fadeUpVariants = {
    initial: { opacity: 0, y: 32 },
    animate: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.12,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    }),
  };

  const slideUpVariants = {
    initial: { y: "110%" },
    animate: (custom: number) => ({
      y: 0,
      transition: {
        delay: 0.4 + custom * 0.14,
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    }),
  };

  return (
    <div
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="absolute inset-y-0 left-24 w-[95%] h-full overflow-hidden z-0">
        <video
          src="/bg.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-contain pointer-events-none mix-blend-multiply contrast-[1.08] brightness-[1.08]"
        />
      </div>

      {/* Main Content: Divided into Left and Right Columns */}
      <div className="flex-1 flex flex-col md:flex-row justify-between w-full px-5 sm:px-8 md:px-12 pb-8 md:pb-12 pt-2 md:pt-4 relative z-10 select-none">
        
        {/* Left Column: Premium Pitch & Auto-Sync Footer */}
        <div className="flex flex-col justify-between pb-6 pt-2 md:pb-10 md:pt-4 max-w-sm md:max-w-md text-left relative z-20 min-h-[300px] md:min-h-[400px]">
          <div className="flex flex-col gap-4">
            {/* Core Bold Headline */}
            <motion.h1
              custom={5}
              variants={fadeUpVariants}
              initial="initial"
              animate="animate"
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-black leading-tight"
            >
              Your job hunt, <br />
              <span className="text-[#5E0ED7]">perfectly tracked.</span>
            </motion.h1>

            {/* Description Paragraph */}
            <motion.p
              custom={6}
              variants={fadeUpVariants}
              initial="initial"
              animate="animate"
              className="text-xs sm:text-sm md:text-base text-gray-500 max-w-xs leading-relaxed"
            >
              A premium dashboard built to organize all your applications, interviews, and offers in one place.
            </motion.p>
          </div>

          {/* Sleek Mock Search Bar (Middle) */}
          <motion.div
            custom={6.5}
            variants={fadeUpVariants}
            initial="initial"
            animate="animate"
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-gray-100 bg-white shadow-sm w-full max-w-[280px] select-none mt-4 md:mt-0"
          >
            <svg
              className="w-3.5 h-3.5 text-gray-400 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-xs text-gray-400 font-medium">Search jobs, companies...</span>
            <div className="ml-auto flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-gray-150 bg-gray-50 text-[8px] font-extrabold text-gray-400">
              <span>⌘</span>
              <span>K</span>
            </div>
          </motion.div>

          {/* Auto-Sync Integrations Footer */}
          <motion.div
            custom={7}
            variants={fadeUpVariants}
            initial="initial"
            animate="animate"
            className="pt-6 border-t border-gray-100 flex flex-col gap-2 mt-8 md:mt-0"
          >
            <span className="text-[9px] sm:text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
              Auto-sync applications
            </span>
            <div className="flex items-center gap-3 text-[10px] sm:text-xs font-semibold text-gray-400 select-none">
              <span>LINKEDIN</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span>INDEED</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span>ZIPRECRUITER</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Interactive/Stats Elements (Stats Row, CTA, Stacked Heading) */}
        <div className="flex flex-col justify-between items-end pb-6 pt-2 md:pb-10 md:pt-4 text-right gap-8 md:gap-0">
          
          {/* Stats Row */}
          <div className="flex items-center gap-5 sm:gap-8 md:gap-10">
            {statItems.map((item) => (
              <motion.div
                key={item.label}
                custom={item.customIndex}
                variants={fadeUpVariants}
                initial="initial"
                animate="animate"
                className="flex flex-col items-end text-right"
              >
                <div
                  className="font-semibold text-black leading-none flex items-start"
                  style={{ fontSize: "clamp(1.5rem, 5vw, 3.5rem)" }}
                >
                  <span
                    className="text-[#5E0ED7] mr-[2px]"
                    style={{ fontSize: "0.5em", lineHeight: "1" }}
                  >
                    +
                  </span>
                  <span>{item.value}</span>
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm font-semibold tracking-widest uppercase text-black whitespace-pre-line leading-tight mt-1.5">
                  {item.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Link */}
          <motion.div
            custom={6}
            variants={fadeUpVariants}
            initial="initial"
            animate="animate"
          >
            <a
              href="#jobs"
              className="text-base sm:text-xl md:text-2xl font-semibold text-[#5E0ED7] whitespace-nowrap flex items-center gap-1 hover:opacity-85 transition-opacity"
            >
              <span>FIND YOUR JOB</span>
              <ArrowUpRight className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] shrink-0" />
            </a>
          </motion.div>

          {/* Stacked Heading Words Clip-Reveal Slide Up */}
          <div className="flex flex-col items-end text-right leading-[0.88] -mt-4 sm:-mt-6 md:-mt-8">
            {["Dream", "Track", "Achieve"].map((word, index) => (
              <div key={index} className="overflow-hidden">
                <motion.div
                  custom={index}
                  variants={slideUpVariants}
                  initial="initial"
                  animate="animate"
                  className="font-semibold text-black uppercase select-none"
                  style={{
                    fontSize: "clamp(2rem, 9vw, 9rem)",
                    lineHeight: 0.88,
                  }}
                >
                  {word}
                </motion.div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
