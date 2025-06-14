import { getJobs } from "@/actions/get-jobs";
import Box from "@/components/box";
import { CustomeBreadCrummb } from "@/components/CustomeBreadCrummb";
import { SearchContainer } from "@/components/SearchContainer";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PageContent } from "../search/_components/PageContent";

interface SearchProps {
  // THIS IS THE CRITICAL CHANGE: searchParams should be typed as a Promise
  // Also, all properties should be optional (with '?'), as they might not be present in the URL.
  // And yearsOfExperience should correctly handle string or string[].
  searchParams: Promise<{
    title?: string;
    categoryId?: string;
    createdAtFilter?: string;
    yearsOfExperience?: string | string[]; // Added string[] type
    workMode?: string;
    employmentType?: string;
    // Add any other expected search parameters here, also as optional
  }>;
}

const savedJobPage = async({searchParams}: SearchProps) => {
  // This line correctly awaits the searchParams Promise
  const awaitedSearchParams = await searchParams;
  const {userId: clerkId} = await auth();

  if(!clerkId){
    return redirect("/");
  }

  // Pass the awaited and resolved searchParams object to getJobs
  const jobs = await getJobs({...awaitedSearchParams, savedUsers: true});
  
  return (
    <div className="flex-col">
      <Box className="mt-4 items-center justify-start gap-2 mb-4 px-2">
        <CustomeBreadCrummb breadCrumbPage="Saved Jobs" createCrumbItem={[]}/>
      </Box>

      <Box className="w-full h-45 bg-gray-200 dark:bg-[#141416] flex items-center justify-center">
        <h2 className="font-sans uppercase text-3xl tracking-wider font-bold">Saved Jobs</h2>
      </Box>

      <div className="px-6 pt-8 md:mb-0">
        <SearchContainer/>
      </div>

      <div className="p-6">
        <PageContent jobs={jobs} userId={clerkId}/>
      </div>
    </div>
  )
}

export default savedJobPage;