// app/(dashboard)/(routes)/search/page.tsx

import { getJobs } from "@/actions/get-jobs";
import { SearchContainer } from "@/components/SearchContainer";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CategoriesList } from "./_components/container-list";
import { PageContent } from "./_components/PageContent";

interface SearchPageProps {
  // --- IMPORTANT CHANGE HERE ---
  // searchParams needs to be typed as a Promise, and all its properties should be optional.
  searchParams: Promise<{
    title?: string;          // Made optional
    categoryId?: string;     // Made optional
    createdAtFilter?: string; // Made optional
    yearsOfExperience?: string | string[]; // Correctly handles string or string[], made optional
    workMode?: string;       // Made optional
    employmentType?: string; // Made optional
    // Add any other specific search parameters your page might expect here, also as optional
  }>;
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return redirect("/");
  }

  // This line correctly awaits the searchParams Promise to get the resolved object
  const awaitedSearchParams = await searchParams;

  // Pass the awaited and resolved searchParams object to getJobs
  const jobs = await getJobs({...awaitedSearchParams}); // Use the awaited version


  return <>
    <div className="px-6 pt-6 block md:hidden md:mb-0">
      <SearchContainer/>
    </div>
    <div className="p-6">
      <CategoriesList categories={categories}/>

      <PageContent jobs={jobs} userId={clerkId}/>
    </div>
  </>
};

export default SearchPage;