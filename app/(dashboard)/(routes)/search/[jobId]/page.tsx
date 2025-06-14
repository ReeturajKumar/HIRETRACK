import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import { JobDetailsPageContent } from "./_components/jobDetailsPageContent";
import { getJobs } from "@/actions/get-jobs";
import { Separator } from "@/components/ui/separator";
import Box from "@/components/box";
import { PageContent } from "../_components/PageContent";

// --- IMPORTANT CHANGE HERE ---
// Define the props interface correctly, ensuring 'params' is typed as a Promise
interface JobDetailsPageProps {
  params: Promise<{
    jobId: string;
  }>;
}

// Update the function signature to use the new interface
const JobDetailsPage = async ({ params }: JobDetailsPageProps) => {
  // Await the params to get the resolved object
  const awaitedParams = await params;
  const { jobId } = awaitedParams; // Destructure jobId from the awaited object

  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return redirect("/");
  }

  const job = await db.job.findUnique({
    where: {
      id: jobId, // Use the resolved jobId
    },
    include: {
      company: true,
    },
  });

  if (!job) {
    return redirect("/search");
  }

  const profile = await db.userProfile.findUnique({
    where: {
      userId: clerkId as string,
    },
    include: {
      resumes: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const jobs = await getJobs({});

  const filterJobs = jobs.filter(
    (j) => j?.id !== job?.id && j.categoryId === job?.categoryId
  );
  return (
    <div className="flex-col p-4 md:p-8">
      <JobDetailsPageContent
        job={job}
        jobId={jobId} // Use the resolved jobId
        userProfile={profile}
      />

      {filterJobs && filterJobs.length > 0 && (
        <>
          <Separator />
          <Box className="flex-col my-4 items-start justify-start px-4 gap-2">
            <h2 className="text-lg font-semibold">Similar Jobs</h2>
          </Box>

          <PageContent jobs={filterJobs} userId={clerkId}/>
        </>
      )}
    </div>
  );
};

export default JobDetailsPage;