"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import qs from "query-string";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
}

interface CultureSectionProps {
  categories: Category[];
}

export const CultureSection = ({ categories }: CultureSectionProps) => {
  const [title, settitle] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const href = qs.stringifyUrl({
      url: "/search",
      query: {
        title: title || ""
      }
    });
    router.push(href);
  };

  const handleImNotSure = () => {
    // Redirect to search with no query to show all jobs
    router.push("/search");
  };

  return (
    <section className="relative w-full min-h-[520px] flex flex-col justify-center items-center pt-12 pb-14 px-4 overflow-hidden text-neutral-950 dark:text-white border-0 transition-colors duration-300">
      {/* 1. Base Theme-Reactive Background Color Layer */}
      <div className="absolute inset-0 bg-white dark:bg-neutral-950 -z-20 pointer-events-none border-0 transition-colors duration-300" />

      {/* 2. Premium Photographic Background Image Wrapper (Centered with constrained width) */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[1100px] pointer-events-none -z-10 border-0">
        <Image 
          src="/culture_bg.png" 
          alt="Culture Background" 
          fill
          priority
          className="object-cover object-center z-0 border-0"
        />
        {/* Soft feathering fade overlays on all four sides of the image to blend it perfectly */}
        {/* Left Side Fade */}
        <div className="absolute inset-y-0 left-0 w-32 sm:w-48 md:w-64 lg:w-80 bg-gradient-to-r from-white via-white/20 to-transparent dark:from-neutral-950 dark:via-neutral-950/20 pointer-events-none z-10 border-0 transition-colors duration-300" />
        
        {/* Right Side Fade */}
        <div className="absolute inset-y-0 right-0 w-32 sm:w-48 md:w-64 lg:w-80 bg-gradient-to-l from-white via-white/20 to-transparent dark:from-neutral-950 dark:via-neutral-950/20 pointer-events-none z-10 border-0 transition-colors duration-300" />

        {/* Top Side Fade */}
        <div className="absolute inset-x-0 top-0 h-16 sm:h-24 bg-gradient-to-b from-white via-white/10 to-transparent dark:from-neutral-950 dark:via-neutral-950/10 pointer-events-none z-10 border-0 transition-colors duration-300" />

        {/* Bottom Side Fade */}
        <div className="absolute inset-x-0 bottom-0 h-20 sm:h-28 bg-gradient-to-t from-white via-white/10 to-transparent dark:from-neutral-950 dark:via-neutral-950/10 pointer-events-none z-10 border-0 transition-colors duration-300" />
      </div>

      <div className="w-full max-w-5xl flex flex-col items-center text-center relative z-10">
        
        {/* Top Orange Dot Badge */}
        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-orange-600 to-amber-400 shadow-[0_0_12px_rgba(234,88,12,0.6)] mb-4 animate-pulse" />

        {/* Heading */}
        <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-[3.25rem] font-bold tracking-tight text-neutral-950 dark:text-white mb-2 leading-tight drop-shadow-md select-none font-sans">
          Find your life&apos;s work
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 font-medium max-w-xl mb-6 leading-relaxed drop-shadow-sm select-none">
          Land a job that feels like freedom.
        </p>

        {/* Interactive Search Container */}
        <div className="w-full max-w-xl relative mb-3">
          <div className="flex items-center w-full rounded-full bg-neutral-900/60 backdrop-blur-xl p-1 pl-5 shadow-[0_8px_32px_rgba(0,0,0,0.37)] transition-all duration-300">
            <input 
              type="text" 
              placeholder="What are you looking for?" 
              value={title}
              onChange={(e) => settitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full bg-transparent border-0 outline-none text-white placeholder-neutral-400 text-sm sm:text-base font-medium py-2.5 pr-4"
            />
            <button 
              onClick={handleSearch}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black hover:bg-neutral-200 transition duration-300 shadow-[0_4px_12px_rgba(255,255,255,0.25)] shrink-0"
            >
              <span className="text-lg font-bold">↑</span>
            </button>
          </div>
        </div>

        {/* I'm not sure Button */}
        <button 
          onClick={handleImNotSure}
          className="bg-neutral-800/50 hover:bg-neutral-800/80 text-neutral-200 text-[12px] sm:text-xs font-semibold px-4.5 py-2 rounded-full backdrop-blur-md transition-all duration-300 shadow-md mb-4 hover:scale-105"
        >
          I&apos;m not sure
        </button>

        {/* Counter Info */}
        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-300 mb-8 select-none">
          <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
          <span>22,482 new jobs</span>
        </div>

        {/* 3D Stacked Cards Layer */}
        <div className="relative w-full max-w-md h-32 flex justify-center items-end select-none">
          
          {/* Card 3 (Back) */}
          <div className="absolute bottom-7 w-[84%] bg-neutral-900/40 backdrop-blur-sm p-4 rounded-2xl flex items-center gap-3 opacity-30 blur-[2px] transform scale-90 translate-y-[-20px] transition-all duration-500">
            <div className="w-9 h-9 rounded-lg bg-violet-500/20 flex items-center justify-center border border-white/10 shrink-0">
              <span className="text-violet-400 text-xs font-bold">M</span>
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-[10px] font-bold text-neutral-500">{categories && categories[2] ? categories[2].name : "Marketing"}</span>
              <span className="text-[12px] font-bold text-neutral-400">Growth Marketing Lead</span>
            </div>
          </div>

          {/* Card 2 (Middle) */}
          <div className="absolute bottom-3.5 w-[92%] bg-neutral-900/60 backdrop-blur-md p-4 rounded-2xl flex items-center gap-3 opacity-60 blur-[0.5px] transform scale-95 translate-y-[-10px] transition-all duration-500">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-white/10 shrink-0">
              <span className="text-emerald-400 text-sm font-bold">E</span>
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-[11px] font-bold text-neutral-400">{categories && categories[1] ? categories[1].name : "Engineering"}</span>
              <span className="text-[13px] font-bold text-neutral-300">Senior Full-Stack Engineer</span>
            </div>
          </div>

          {/* Card 1 (Front) */}
          <div 
            onClick={() => router.push(`/search?categoryId=${categories && categories[0] ? categories[0].id : ""}`)}
            className="absolute bottom-0 w-full bg-neutral-900/90 backdrop-blur-2xl p-4 rounded-2xl flex items-center justify-between gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.6)] transform hover:translate-y-[-4px] transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              {/* Databricks style logo */}
              <div className="w-11 h-11 rounded-xl bg-[#FF453A] flex items-center justify-center border border-white/15 shadow-[0_4px_12px_rgba(255,69,58,0.3)] shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" />
                  <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex flex-col items-start text-left truncate">
                <span className="text-[11px] font-bold text-neutral-400">Databricks</span>
                <span className="text-[14px] font-bold text-white tracking-tight truncate">
                  {categories && categories[0] ? `${categories[0].name} Specialist` : "Enterprise Hunter Account Exec..."}
                </span>
              </div>
            </div>
            {/* Soft active indicator */}
            <span className="text-[11px] font-bold bg-white text-black hover:bg-neutral-200 px-3 py-1.5 rounded-full shadow-[0_2px_8px_rgba(255,255,255,0.15)] shrink-0 transition duration-300">
              Apply
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};
