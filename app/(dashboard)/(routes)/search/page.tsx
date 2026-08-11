
// app/(dashboard)/(routes)/search/page.tsx

import { getJobs } from "@/actions/get-jobs";
import { SearchContainer } from "@/components/SearchContainer";
import getDb from "@/lib/db";
import { serializeArray } from "@/lib/serialize";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { CategoriesList } from "./_components/container-list";
import { PageContent } from "./_components/PageContent";
import { FilterContainer } from "../../_components/FilterContainer";

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
  const db = await getDb();
  const categoriesDocs = await db.collection("Category").find({}).sort({ name: 1 }).toArray();
  const categories = serializeArray(categoriesDocs.map((c) => ({ ...c, id: c._id.toString() })));

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
      <Suspense fallback={null}>
        <SearchContainer/>
      </Suspense>
    </div>

    <div className="flex flex-col md:flex-row h-full">
      <div className="hidden md:flex flex-col w-80 border-r p-6 shrink-0">
        <FilterContainer />
      </div>
      
      <div className="flex-1 p-6">
        <Suspense fallback={null}>
          <CategoriesList categories={categories}/>
        </Suspense>

        <PageContent jobs={jobs} userId={clerkId}/>
      </div>
    </div>
  </>
};

export default SearchPage;