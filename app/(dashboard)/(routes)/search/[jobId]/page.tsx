
import getDb from "@/lib/db";
import { ObjectId } from "mongodb";
import { serialize } from "@/lib/serialize";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import { JobDetailsPageContent } from "./_components/jobDetailsPageContent";
import { getJobs } from "@/actions/get-jobs";
import { Separator } from "@/components/ui/separator";
import Box from "@/components/box";
import { PageContent } from "../_components/PageContent";
import { UserProfile, Job, Company } from "@/lib/types/models";

interface JobDetailsPageProps {
  params: Promise<{ jobId: string }>;
}

const JobDetailsPage = async ({ params }: JobDetailsPageProps) => {
  const { jobId } = await params;
  const { userId: clerkId } = await auth();

  if (!clerkId) return redirect("/");

  const db = await getDb();

  const jobDoc = await db.collection("Job").findOne({ _id: new ObjectId(jobId) });
  if (!jobDoc) return redirect("/search");

  const companyDoc = jobDoc.companyId
    ? await db.collection("Company").findOne({ _id: new ObjectId(jobDoc.companyId) })
    : null;

  const job = serialize<Job & { company: Company }>({
    ...jobDoc,
    id: jobDoc._id.toString(),
    company: companyDoc ? serialize({ ...companyDoc, id: companyDoc._id.toString() }) : null,
  });

  const profileDoc = await db.collection("UserProfile").findOne({ userId: clerkId });
  const resumesDocs = profileDoc
    ? await db.collection("Resumes").find({ userProfileId: clerkId }).sort({ createdAt: -1 }).toArray()
    : [];

  const profile = profileDoc
    ? serialize<UserProfile>({
        ...profileDoc,
        resumes: resumesDocs.map((r) => ({ ...r, id: r._id.toString() })),
        appliedJobs: profileDoc.appliedJobs ?? [],
      })
    : null;

  const jobs = await getJobs({});
  const filterJobs = jobs.filter((j) => j?.id !== job?.id && j.categoryId === job?.categoryId);

  return (
    <div className="flex-col p-4 md:p-8">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <JobDetailsPageContent job={job} jobId={jobId} userProfile={profile} />

      {filterJobs && filterJobs.length > 0 && (
        <>
          <Separator />
          <Box className="flex-col my-4 items-start justify-start px-4 gap-2">
            <h2 className="text-lg font-semibold">Similar Jobs</h2>
          </Box>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <PageContent jobs={filterJobs as any} userId={clerkId} />
        </>
      )}
    </div>
  );
};

export default JobDetailsPage;