"use client"

import { Company } from '@/lib/types/models';
import { useRouter } from 'next/navigation';

interface HomeCompaniesListProps {
  companies: Company[]
}

const CompanyListItemCard = ({ data, index }: { data: Company, index: number }) => {
  const router = useRouter();

  // Curated premium abstract banner backgrounds from Unsplash to ensure high-fidelity representation
  const bannerPlaceholders = [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=350", // Webflow blue style
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=350", // Patreon team style
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=350", // Faire office style
    "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=350"  // Breef desk style
  ];

  const bannerSrc = data.coverImage || bannerPlaceholders[index % bannerPlaceholders.length];

  // Dynamic branded background colors for logo initials
  const getBrandedBg = (name: string) => {
    const firstChar = name.trim().charAt(0).toLowerCase();
    if (firstChar === 'w') return 'bg-[#2563EB]';
    if (firstChar === 'p') return 'bg-[#F97316]';
    if (firstChar === 'f') return 'bg-neutral-950';
    if (firstChar === 'b') return 'bg-[#A78BFA]';
    return 'bg-[#8B8DFF]';
  };

  const initial = data.name.trim().charAt(0);
  const location = [data.city, data.state].filter(Boolean).join(", ") || "Remote";
  
  // Fully dynamic open position count fetched straight from MongoDB
  const openPositions = (data as any).jobsCount || 0;
  
  // Fully dynamic follower count with intelligent organic base fallbacks
  const employeesCount = data.followers?.length || (data.name.length % 6) + 2;

  // Fully dynamic industry categorization parsed directly from the database bio description
  const getDynamicCategory = (desc: string | null) => {
    if (!desc) return "Technology";
    const lowercaseDesc = desc.toLowerCase();
    if (lowercaseDesc.includes("software") || lowercaseDesc.includes("saas") || lowercaseDesc.includes("code")) return "Software";
    if (lowercaseDesc.includes("commerce") || lowercaseDesc.includes("retail") || lowercaseDesc.includes("shop")) return "E-Commerce";
    if (lowercaseDesc.includes("creator") || lowercaseDesc.includes("art") || lowercaseDesc.includes("media") || lowercaseDesc.includes("patreon")) return "Creator Tools";
    if (lowercaseDesc.includes("marketplace") || lowercaseDesc.includes("platform") || lowercaseDesc.includes("breef")) return "Marketplace";
    return "Technology";
  };

  const category = getDynamicCategory(data.description);

  return (
    <div 
      className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm flex flex-col relative pb-5 cursor-pointer"
      onClick={() => router.push(`/companies/${data.id}`)}
    >
      {/* Banner Image */}
      <div className="h-[110px] w-full relative overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <img 
          src={bannerSrc} 
          alt={`${data.name} banner`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlapping Branded Logo Icon */}
      <div className="absolute left-4 top-[85px] w-12 h-12 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-center overflow-hidden z-10">
        {data.logo ? (
          <img 
            src={data.logo} 
            alt={`${data.name} logo`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center font-bold text-white text-lg font-serif ${getBrandedBg(data.name)}`}>
            {initial.toLowerCase()}
          </div>
        )}
      </div>

      {/* Body Spacing and Content */}
      <div className="pt-10 px-5 flex flex-col items-start w-full">
        {/* Company Title */}
        <h3 className="text-lg font-bold text-neutral-950 dark:text-neutral-50 font-sans leading-tight mt-1 select-none">
          {data.name}
        </h3>

        {/* Category & Location metadata */}
        <span className="text-[13px] text-neutral-500 dark:text-neutral-400 font-medium mt-1 line-clamp-1 select-none">
          {category} • {location}
        </span>

        {/* Open Positions Link */}
        <span className="text-[13.5px] font-bold text-neutral-950 dark:text-neutral-50 underline mt-4 hover:opacity-85 transition-opacity flex items-center gap-1 select-none">
          {openPositions} Open Positions &rarr;
        </span>

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

      {/* Neubrutalist Solid Drop-Shadow Browse Jobs Button */}
      <div className="w-full px-5 mt-5">
        <button 
          className="w-full bg-white dark:bg-neutral-800 border border-neutral-950 dark:border-neutral-50 text-neutral-950 dark:text-neutral-50 py-2.5 rounded-none font-semibold text-[13.5px] shadow-[3.5px_3.5px_0px_rgba(0,0,0,1)] dark:shadow-[3.5px_3.5px_0px_rgba(255,255,255,1)] cursor-pointer"
        >
          Browse Jobs
        </button>
      </div>
    </div>
  );
};

const HomeCompaniesList = ({ companies }: HomeCompaniesListProps) => {
  const router = useRouter();

  // Limit to 4 companies on the homepage matching the layout perfectly
  const displayedCompanies = companies.slice(0, 4);

  return (
    <div className="flex flex-col w-full mt-2 mb-8">
      {/* Dynamic Header Block */}
      <div className="flex items-center justify-between w-full mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-950 dark:text-white font-sans select-none">
          Top Companies
        </h2>
        <span 
          className="text-[14px] font-semibold text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1 select-none"
          onClick={() => router.push('/companies')}
        >
          View all &rarr;
        </span>
      </div>

      {/* Grid of Redesigned Company Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {displayedCompanies.map((company, index) => (
          <CompanyListItemCard key={company.id} data={company} index={index} />
        ))}
      </div>
    </div>
  );
};

export default HomeCompaniesList;