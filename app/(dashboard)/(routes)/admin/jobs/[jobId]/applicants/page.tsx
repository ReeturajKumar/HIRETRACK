

import getDb from '@/lib/db';
import { ObjectId } from 'mongodb';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { ApplicantsColumns, columns } from './_components/columns';
import { Job } from '@/lib/types/models';
import { format } from 'date-fns';
import Box from '@/components/box';
import { CustomeBreadCrummb } from '@/components/CustomeBreadCrummb';
import { DataTable } from '@/components/ui/data-table';

type JobApplicantsPageProps = {
  params: Promise<{ jobId: string }>;
};

const JobApplicantsPage = async ({ params }: JobApplicantsPageProps) => {
  const { jobId } = await params;
  const { userId: clerkId } = await auth();

  if (!clerkId) redirect("/sign-in");

  const db = await getDb();
  const mongoUser = await db.collection("User").findOne({ clerkId });
  if (!mongoUser) redirect("/");

  const jobDoc = await db.collection("Job").findOne({
    _id: new ObjectId(jobId),
    userId: mongoUser._id.toString(),
  });

  if (!jobDoc) redirect("/admin/jobs");
  const job = { ...jobDoc, id: jobDoc._id.toString() } as unknown as Job;

  // Get all profiles that have applied to this job
  const allProfiles = await db.collection("UserProfile").find({}).toArray();
  const filteredProfiles = allProfiles.filter((profile) =>
    (profile.appliedJobs ?? []).some((aj: { jobId: string; appliedAt: Date }) => aj.jobId === jobId)
  );

  const formattedProfiles: ApplicantsColumns[] = await Promise.all(
    filteredProfiles.map(async (profile) => {
      const resumes = await db
        .collection("Resumes")
        .find({ userProfileId: profile.userId })
        .sort({ createdAt: -1 })
        .toArray();

      const appliedEntry = (profile.appliedJobs ?? []).find(
        (aj: { jobId: string; appliedAt: Date }) => aj.jobId === jobId
      );

      return {
        id: profile.userId,
        fullname: profile.fullName || "",
        email: profile.email || "",
        contact: profile.contact || "",
        appliedAt: appliedEntry?.appliedAt
          ? format(new Date(appliedEntry.appliedAt), "dd MMMM yyyy")
          : "",
        resume: resumes[0]?.url || "",
        resumeName: resumes[0]?.name || "",
      };
    })
  );

  return (
    <div className='flex-col p-4 md:p-8 items-center justify-center flex'>
      <Box>
        <CustomeBreadCrummb
          breadCrumbPage='Applicants'
          createCrumbItem={[
            { link: "/admin/jobs", label: "Jobs" },
            { link: `/admin/jobs/${job.id}`, label: `${job.title}` }
          ]}
        />
      </Box>

      <div className='mt-6 w-full'>
        <DataTable columns={columns} data={formattedProfiles} searchKey='fullname' />
      </div>
    </div>
  );
};

export default JobApplicantsPage;