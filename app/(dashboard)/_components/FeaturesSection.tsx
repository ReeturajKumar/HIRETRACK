"use client";

import React, { useState } from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  mockup: React.ReactNode;
}

const FeatureCard = ({ icon, title, description, mockup }: FeatureCardProps) => {
  const [localCoords, setLocalCoords] = useState({ x: 0, y: 0 });
  const [localIsHovered, setLocalIsHovered] = useState(false);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setLocalCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div 
      className="relative overflow-hidden rounded-3xl border border-neutral-900/50 bg-neutral-950/20 p-4 sm:p-5 backdrop-blur-xl transition-all duration-500 hover:border-neutral-700/60 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.6)] group cursor-pointer flex flex-col justify-between min-h-[300px] sm:min-h-[320px] md:min-h-[330px]"
      onMouseMove={handleCardMouseMove}
      onMouseEnter={() => setLocalIsHovered(true)}
      onMouseLeave={() => setLocalIsHovered(false)}
    >
      {/* Card Base Dark Overlay Gradient */}
      <div 
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500 rounded-3xl bg-gradient-to-b from-neutral-900/40 to-neutral-950/70 group-hover:from-neutral-900/60 group-hover:to-neutral-950/80"
      />
      
      {/* Cursor-Tracking Local Spotlight Glow */}
      {localIsHovered && (
        <div 
          className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-300 rounded-3xl"
          style={{
            background: `radial-gradient(180px circle at ${localCoords.x}px ${localCoords.y}px, rgba(217,252,51,0.06), transparent 100%)`,
          }}
        />
      )}

      {/* Card Content Wrapper */}
      <div className="flex flex-col items-start w-full">
        {/* Glowing SVG Container (More compact size) */}
        <div className="w-12 h-12 flex items-center justify-center select-none relative z-10 transition-transform duration-500 group-hover:scale-105">
          {icon}
        </div>
        
        <h3 className="text-lg sm:text-xl font-bold text-white mt-3 select-none transition-colors duration-300 group-hover:text-white">
          {title}
        </h3>
        
        <p className="text-[13px] sm:text-[14px] text-neutral-400 font-medium leading-normal mt-1.5 max-w-sm select-none">
          {description}
        </p>
      </div>

      {/* Floating Mockup UI Container */}
      <div className="w-full relative z-10 select-none transition-transform duration-500 group-hover:translate-y-[-2px]">
        {mockup}
      </div>
    </div>
  );
};

export const FeaturesSection = () => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Card 1 Icon: Overlapping profiles scaled down to 48px
  const card1Icon = (
    <svg width="48" height="48" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "drop-shadow(0 0 8px rgba(188, 166, 255, 0.35)) drop-shadow(0 0 12px rgba(255, 139, 139, 0.15))" }}>
      {/* Back profile (Purple) */}
      <circle cx="24" cy="24" r="12" fill="#BCA6FF" stroke="#000000" strokeWidth="2.5" className="transition-transform duration-500 group-hover:translate-x-[-1px]" />
      <path d="M8 48C8 39.1634 15.1634 32 24 32C32.8366 32 40 39.1634 40 48" fill="#BCA6FF" stroke="#000000" strokeWidth="2.5" className="transition-transform duration-500 group-hover:translate-x-[-1px]" />
      
      {/* Front profile (Coral) */}
      <circle cx="34" cy="28" r="11" fill="#FF8B8B" stroke="#000000" strokeWidth="2.5" className="transition-transform duration-500 group-hover:translate-y-[-1px] group-hover:translate-x-[1px]" />
      <path d="M19 50C19 41.7157 25.7157 35 34 35C42.2843 35 49 41.7157 49 50" fill="#FF8B8B" stroke="#000000" strokeWidth="2.5" className="transition-transform duration-500 group-hover:translate-y-[-1px] group-hover:translate-x-[1px]" />
      
      {/* Neon Lime Checkmark Badge */}
      <circle cx="44" cy="44" r="8" fill="#D9FC33" stroke="#000000" strokeWidth="2.5" className="transition-transform duration-500 group-hover:scale-110" />
      <path d="M40.5 44L43 46.5L47.5 41.5" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  // Card 2 Icon: Messenger bubble scaled down to 48px
  const card2Icon = (
    <svg width="48" height="48" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-[-6deg] group-hover:rotate-[4deg] group-hover:scale-105 transition-all duration-500 ease-out" style={{ filter: "drop-shadow(0 0 10px rgba(196, 181, 253, 0.4))" }}>
      {/* Shadow/Outline speech bubble */}
      <rect x="10" y="10" width="40" height="32" rx="16" fill="#C4B5FD" stroke="#000000" strokeWidth="2.5" />
      {/* Speech tail */}
      <path d="M22 41L14 49V41H22Z" fill="#C4B5FD" stroke="#000000" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Message Dots with custom bouncing animation classes */}
      <circle cx="22" cy="26" r="2.5" fill="#000000" className="animate-dot-1" />
      <circle cx="30" cy="26" r="2.5" fill="#000000" className="animate-dot-2" />
      <circle cx="38" cy="26" r="2.5" fill="#000000" className="animate-dot-3" />
    </svg>
  );

  // Card 3 Icon: Abstract double chevrons scaled down to 48px
  const card3Icon = (
    <svg width="48" height="48" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "drop-shadow(0 0 10px rgba(217, 252, 51, 0.35))" }}>
      {/* Left chevron (Neon Green) */}
      <path d="M12 16L24 30L12 44" stroke="#D9FC33" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-[-1px]" />
      <path d="M12 16L24 30L12 44" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-[-1px]" />
      
      {/* Right chevron (Crisp White) */}
      <path d="M28 16L40 30L28 44" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-[2px]" />
      <path d="M28 16L40 30L28 44" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-[2px]" />
    </svg>
  );

  // Mockup 1: Ultra Compact Direct Message conversation window
  const card1Mockup = (
    <div className="mt-3 w-full rounded-xl border border-white/10 bg-neutral-950/40 p-3 relative overflow-hidden backdrop-blur-md transition-all duration-300 group-hover:border-white/15">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="relative shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120"
              alt="Recruiter" 
              className="w-8 h-8 rounded-full border border-white/20 object-cover"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-neutral-950 animate-pulse" />
          </div>
          <div className="flex flex-col text-left truncate">
            <span className="text-[11px] font-bold text-white leading-tight">Sarah Jenkins</span>
            <span className="text-[9px] text-neutral-400 font-medium truncate leading-tight">Head of Talent @ Vercel</span>
          </div>
        </div>
        <span className="text-[9px] font-bold text-[#D9FC33] bg-[#D9FC33]/10 px-2 py-0.5 rounded-full border border-[#D9FC33]/20 shrink-0">
          Online
        </span>
      </div>
      <div className="mt-2 text-[11px] text-neutral-300 font-medium leading-normal bg-neutral-900/60 p-2 rounded-lg border border-white/5 truncate">
        &quot;Loved your profile! Free for a sync?&quot;
      </div>
    </div>
  );

  // Mockup 2: Ultra Compact Premium Candidate Profile dashboard card
  const card2Mockup = (
    <div className="mt-3 w-full rounded-xl border border-white/10 bg-neutral-950/40 p-3 relative overflow-hidden backdrop-blur-md flex flex-col gap-2 transition-all duration-300 group-hover:border-white/15">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#BCA6FF] to-[#C4B5FD] flex items-center justify-center font-bold text-neutral-950 text-[11px] shadow-[0_3px_8px_rgba(188,166,255,0.3)] shrink-0">
            AR
          </div>
          <div className="flex flex-col text-left truncate">
            <span className="text-[11px] font-bold text-white leading-tight">Alex Rivera</span>
            <span className="text-[9px] text-neutral-400 font-medium truncate leading-tight">Product Designer</span>
          </div>
        </div>
        <span className="text-[9px] font-bold text-[#D9FC33] shrink-0">
          98% Match
        </span>
      </div>
      
      {/* Interactive Tech Badges */}
      <div className="flex flex-wrap gap-1">
        <span className="text-[8px] font-bold text-[#BCA6FF] bg-[#BCA6FF]/10 px-1.5 py-0.5 rounded border border-[#BCA6FF]/20">
          Next.js
        </span>
        <span className="text-[8px] font-bold text-[#D9FC33] bg-[#D9FC33]/10 px-1.5 py-0.5 rounded border border-[#D9FC33]/20">
          Figma
        </span>
        <span className="text-[8px] font-bold text-white bg-neutral-800/60 px-1.5 py-0.5 rounded border border-white/5">
          Tailwind
        </span>
      </div>
    </div>
  );

  // Mockup 3: Ultra Compact Active Feedback Timeline
  const card3Mockup = (
    <div className="mt-3 w-full rounded-xl border border-white/10 bg-neutral-950/40 p-3 relative overflow-hidden backdrop-blur-md flex flex-col gap-2 transition-all duration-300 group-hover:border-white/15">
      {/* Timeline item 1 */}
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
          <span className="text-emerald-400 text-[8px] font-bold">✓</span>
        </div>
        <div className="flex flex-col items-start leading-none">
          <span className="text-[10px] font-bold text-neutral-200">Application Submitted</span>
          <span className="text-[8px] text-neutral-500 mt-0.5">2h ago</span>
        </div>
      </div>
      
      {/* Timeline active item 2 */}
      <div className="flex items-center justify-between relative">
        <div className="absolute left-[7px] top-[-10px] w-[2px] h-[10px] bg-neutral-800" />
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#D9FC33]/20 border border-[#D9FC33]/30 flex items-center justify-center shrink-0 animate-pulse">
            <span className="text-[#D9FC33] text-[7px] font-bold">●</span>
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="text-[10px] font-bold text-white">Interview Invited</span>
            <span className="text-[8px] text-[#D9FC33] font-semibold mt-0.5">Just now</span>
          </div>
        </div>
        <span className="text-[8px] font-bold bg-[#D9FC33] text-neutral-950 px-1.5 py-0.5 rounded-full shadow-[0_0_6px_rgba(217,252,51,0.4)]">
          Active
        </span>
      </div>
    </div>
  );

  return (
    <section 
      className="relative w-full text-white py-6 sm:py-8 md:py-10 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Custom Global Animation Injector */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dotJump {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-dot-1 {
          animation: dotJump 1.4s infinite ease-in-out;
        }
        .animate-dot-2 {
          animation: dotJump 1.4s infinite ease-in-out 0.2s;
        }
        .animate-dot-3 {
          animation: dotJump 1.4s infinite ease-in-out 0.4s;
        }
      `}} />

      {/* Base Solid Background Color Layer */}
      <div className="absolute inset-0 bg-neutral-950 -z-20 pointer-events-none" />

      {/* Interactive Grid Overlay with Spotlight Mask */}
      <div 
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(217,252,51,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(217,252,51,0.08)_1px,transparent_1px)] bg-[size:44px_44px] transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          WebkitMaskImage: `radial-gradient(280px circle at ${coords.x}px ${coords.y}px, black 30%, transparent 100%)`,
          maskImage: `radial-gradient(280px circle at ${coords.x}px ${coords.y}px, black 30%, transparent 100%)`,
        }}
      />

      {/* Soft Glow Spotlight Layer */}
      <div 
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, rgba(217,252,51,0.12), rgba(217,252,51,0.02) 40%, transparent 100%)`,
        }}
      />

      <div className="max-w-7xl mx-auto w-full px-6 md:px-10 flex flex-col items-start">
        
        {/* Header Block */}
        <div className="w-full flex flex-col items-start select-none">
          <span className="text-[#D9FC33]/90 dark:text-[#D9FC33] font-extrabold tracking-widest text-[10px] sm:text-[11px] uppercase mb-1.5 select-none">
            ✦ CORE FEATURES
          </span>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-[2.2rem] lg:text-[2.5rem] font-extrabold tracking-tight text-white leading-[1.1]">
            Your new path to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D9FC33] via-emerald-400 to-[#BCA6FF] drop-shadow-[0_0_20px_rgba(217,252,51,0.25)]">hired</span>.
          </h2>
        </div>

        {/* 3-Column Premium Glassmorphic Cards Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-4 sm:mt-6">
          <FeatureCard 
            icon={card1Icon}
            title="Apply to humans"
            description="72% of applications are never seen by a human! With parallel you skip the line and go direct to the hiring team."
            mockup={card1Mockup}
          />
          <FeatureCard 
            icon={card2Icon}
            title="Instantly stand out"
            description="Showcase your projects, passions and work ethos with Parallel Profile to stand out from the crowd."
            mockup={card2Mockup}
          />
          <FeatureCard 
            icon={card3Icon}
            title="Real time feedback"
            description="Don't get ghosted! Get feedback & notifications with every application, so that you're never left wondering."
            mockup={card3Mockup}
          />
        </div>

      </div>
    </section>
  );
};
