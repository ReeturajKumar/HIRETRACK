"use client"

import { Job, Company } from "@/lib/types/models";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface RecommendedJobsListProps { 
  jobs: Job[]
  userId: string | null
}

const JobListItemCard = ({ data, index, userId }: { data: any, index: number, userId: string | null }) => {
  const router = useRouter();
  
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(
    userId ? data.savedUsers?.includes(userId) : false
  );

  // Dynamic branded background colors for logo initials matching the reference image
  const getBrandedBg = (name: string) => {
    const firstChar = name.trim().charAt(0).toLowerCase();
    if (firstChar === 'b') return 'bg-[#14532D]'; // Bowery Dark Green
    if (firstChar === 'c') return 'bg-[#EA580C]'; // Cartloop Deep Orange
    if (firstChar === 'f') return 'bg-neutral-950'; // Faire Solid Black
    if (firstChar === 'p') return 'bg-[#EF4444]'; // Patreon Red
    return 'bg-[#8B8DFF]';
  };

  const companyName = data.company?.name || "HireTrack Partner";
  const initial = companyName.trim().charAt(0);
  const location = [data.company?.city, data.company?.state].filter(Boolean).join(", ") || "Remote";
  
  // Calculate dynamic but deterministic values for active employees
  const employeesCount = (data.title.charCodeAt(0) % 4) + 2;

  const onClickSavedJob = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card navigation click when bookmarking
    if (!userId) {
      toast.error("Please log in to save jobs");
      return;
    }
    
    try {
      setBookmarkLoading(true);
      if (isSaved) {
        await axios.patch(`/api/jobs/${data.id}/unsaveJob`);
        toast.success("Job Removed Successfully");
        setIsSaved(false);
      } else {
        await axios.patch(`/api/jobs/${data.id}/savedJob`);
        toast.success("Job Added Successfully");
        setIsSaved(true);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(`Error: ${(error as Error)?.message}`);
    } finally {
      setBookmarkLoading(false);
    }
  };

  // String formatting helper for database tokens
  const getFormattedVal = (str: string | null) => {
    if (!str) return null;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase().replace(/_/g, " ");
  };

  return (
    <div 
      className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm flex flex-col relative pb-5 cursor-pointer"
      onClick={() => router.push(`/search/${data.id}`)}
    >
      {/* Top Row: Logo Badge & Heart Save Icon */}
      <div className="w-full flex items-center justify-between select-none">
        <div className="w-10 h-10 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-center overflow-hidden">
          {data.company?.logo ? (
            <img 
              src={data.company.logo} 
              alt={`${companyName} logo`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center font-bold text-white text-base font-serif ${getBrandedBg(companyName)}`}>
              {initial.toLowerCase()}
            </div>
          )}
        </div>

        {/* Dynamic Interactive Heart Bookmark Icon */}
        <button
          onClick={onClickSavedJob}
          disabled={bookmarkLoading}
          className="p-1.5 rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors border-none bg-transparent cursor-pointer flex items-center justify-center"
        >
          {bookmarkLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
          ) : (
            <Heart 
              className={cn(
                "w-5 h-5 transition-colors duration-200",
                isSaved ? "text-red-500 fill-red-500" : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500"
              )} 
            />
          )}
        </button>
      </div>

      {/* Body: Job Details */}
      <div className="mt-4 flex flex-col items-start w-full flex-grow">
        {/* Job Title */}
        <h3 className="text-lg font-bold text-neutral-950 dark:text-neutral-50 font-sans leading-tight line-clamp-2 min-h-[48px] select-none">
          {data.title}
        </h3>

        {/* Company & Location Metadata */}
        <span className="text-[13px] text-neutral-500 dark:text-neutral-400 font-medium mt-2 line-clamp-1 select-none">
          {companyName} • {location}
        </span>

        {/* Dynamic Job Info Chips */}
        <div className="flex flex-wrap gap-1.5 mt-3.5 select-none">
          {data.employmentType && (
            <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
              {getFormattedVal(data.employmentType)}
            </span>
          )}
          {data.workMode && (
            <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
              {getFormattedVal(data.workMode)}
            </span>
          )}
          {data.yearsOfExperience && (
            <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
              {getFormattedVal(data.yearsOfExperience)}
            </span>
          )}
        </div>

        {/* Active Employee Avatar Pile */}
        <div className="mt-4 w-full flex items-center gap-2 select-none">
          <div className="flex items-center -space-x-1.5">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=40" 
              className="w-5 h-5 rounded-full border border-white dark:border-neutral-900 object-cover"
              alt="Employee 1"
            />
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=40" 
              className="w-5 h-5 rounded-full border border-white dark:border-neutral-900 object-cover"
              alt="Employee 2"
            />
            <span className="w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-300 text-[9px] font-bold flex items-center justify-center border border-white dark:border-neutral-900">
              +{employeesCount}
            </span>
          </div>
          <span className="text-[12px] text-neutral-500 dark:text-neutral-400 font-medium">
            Active Employees
          </span>
        </div>
      </div>

      {/* Neubrutalist Solid Drop-Shadow Apply Direct Button */}
      <div className="w-full mt-5">
        <button 
          className="w-full bg-white dark:bg-neutral-800 border border-neutral-950 dark:border-neutral-50 text-neutral-950 dark:text-neutral-50 py-2.5 rounded-none font-semibold text-[13.5px] shadow-[3.5px_3.5px_0px_rgba(0,0,0,1)] dark:shadow-[3.5px_3.5px_0px_rgba(255,255,255,1)] cursor-pointer"
        >
          Apply Direct
        </button>
      </div>
    </div>
  );
};

const RecommendedJobsList = ({ jobs, userId }: RecommendedJobsListProps) => {
  const router = useRouter();

  // Limit to 4 trending jobs on the homepage matching the layout perfectly
  const displayedJobs = jobs.slice(0, 4);

  return (
    <div className="flex flex-col w-full mt-16 mb-8">
      {/* Dynamic Header Block */}
      <div className="flex items-center justify-between w-full mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-950 dark:text-white font-sans select-none">
          Trending jobs
        </h2>
        <span 
          className="text-[14px] font-semibold text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1 select-none"
          onClick={() => router.push('/search')}
        >
          View all &rarr;
        </span>
      </div>

      {/* Grid of Redesigned Job Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {displayedJobs.map((job, index) => (
          <JobListItemCard key={job.id} data={job} index={index} userId={userId} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedJobsList;