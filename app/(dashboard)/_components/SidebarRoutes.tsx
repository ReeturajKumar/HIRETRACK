/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { BookMarked, Compass, Home, List, UserIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { SidebarRouteItem } from "./SidebarRouteItem"
import Box from "@/components/box";
import { Separator } from "@/components/ui/separator";
import { DateFilter } from "./DateFilter";
import { CheckboxContainer } from "./CheckboxContainer";
import  qs  from 'query-string';

const adminRoutes = [
  {
    icon: List,
    label: "Jobs",
    href: "/admin/jobs",
  },
  {
    icon: List,
    label: "Companies",
    href: "/admin/companies",
  },
  {
    icon: Compass,
    label: "Analytics",
    href: "/admin/analytics",
  }
]


const guestRoutes = [
  {
    icon: Home,
    label: "Home",
    href: "/",
  },
  {
    icon: Compass,
    label: "Browse Jobs",
    href: "/search",
  },
  {
    icon: UserIcon,
    label: "Profile",
    href: "/user",
  },
  {
    icon: BookMarked,
    label: "Saved Jobs",
    href: "/savedJobs",
  },
]

  const shiftTimingsData = [
  {
    value: "full-time",
    label: "Full Time",
  },
  {
    value: "part-time",
    label: "Part Time",
  },
  {
    value: "contract",
    label: "Contract",
  },
];

const workingModesData = [
  {
    value: "remote",
    label: "Remote",
  },
  {
    value: "hybrid",
    label: "Hybrid",
  },
  {
    value: "work-from-home",
    label: "Work From Home",
  },
  {
    value: "work-from-office",
    label: "Work From Office",
  },
];



const experienceData = [
  {
    value: "0-1-years",
    label: "Fresher",
  },
  {
    value: "1-3-years",
    label: "1-3 Years",
  },
  {
    value: "3-5-years",
    label: "3-5 Years",
  },
  {
    value: "5-plus-years",
    label: "5+ Years",
  }
];




export const SidebarRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isAdminPage = pathname.startsWith("/admin");
  const routes = isAdminPage ? adminRoutes : guestRoutes;
  const isSearchPage = pathname.startsWith("/search");

const handleShiftTimingChange = (employmentType: any[]) => {
  const currentqueryParams = qs.parseUrl(window.location.href).query;
  const updatedQueryParams = {
    ...currentqueryParams,
    employmentType,
  };
  const url = qs.stringifyUrl(
    { url: pathname, query: updatedQueryParams },
    { skipNull: true, skipEmptyString: true }
  );
  router.push(url);
};



const handleWorkModeChange = (workMode: any[]) => {
  const currentqueryParams = qs.parseUrl(window.location.href).query;
  const updatedQueryParams = {
    ...currentqueryParams,
    workMode,
  };
  const url = qs.stringifyUrl(
    { url: pathname, query: updatedQueryParams },
    { skipNull: true, skipEmptyString: true, arrayFormat: "comma" }
  );
  router.push(url);
};


const handleExperienceChange = (yearsOfExperience: any[]) => {
  const currentqueryParams = qs.parseUrl(window.location.href).query;
  const updatedQueryParams = {
    ...currentqueryParams,
    yearsOfExperience,
  };
  const url = qs.stringifyUrl(
    { url: pathname, query: updatedQueryParams },
    { skipNull: true, skipEmptyString: true }
  );
  router.push(url);
};

  return (
    <div className="flex flex-col w-full space-y-2">
      {routes.map((route) => (
      <SidebarRouteItem key={route.href} icon={route.icon} label={route.label} href={route.href} {...router}/>
      ))}

      {isSearchPage && (
        <Box className="px-4 py-4 items-start justify-start space-y-4 flex-col ">
          <Separator />
          <h2 className="text-lg font-semibold text-muted-foreground tracking-wide">Filters</h2>

          {/* filter the data by created at */}
          <DateFilter/>

          <Separator/>
          <h2 className="text-lg font-semibold text-muted-foreground tracking-wide">Employment Type</h2>

          <CheckboxContainer data={shiftTimingsData} onChange={handleShiftTimingChange}/>



           <Separator/>
          <h2 className="text-lg font-semibold text-muted-foreground tracking-wide">Work Mode</h2>

          <CheckboxContainer data={workingModesData} onChange={handleWorkModeChange}/>


           <Separator/>
          <h2 className="text-lg font-semibold text-muted-foreground tracking-wide"> Work Experience</h2>

          <CheckboxContainer data={experienceData} onChange={handleExperienceChange}/>

        </Box>
      )}
    </div>
  )
}
