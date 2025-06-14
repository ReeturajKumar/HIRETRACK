/* eslint-disable @typescript-eslint/no-unused-vars */
import db from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { ApplicantsColumns, columns } from './_components/columns';
import { format } from 'date-fns';
import Box from '@/components/box';
import { CustomeBreadCrummb } from '@/components/CustomeBreadCrummb';
import { DataTable } from '@/components/ui/data-table';

// Make sure to define the type correctly for params as a Promise
type JobApplicantsPageProps = {
  params: Promise<{
    jobId: string;
  }>;
};

// Update the component's signature to use the correct type
const JobApplicantsPage = async ({ params }: JobApplicantsPageProps) => {
  // --- CRUCIAL CHANGE: Await params to get the actual object ---
  const resolvedParams = await params;
  const jobId = resolvedParams.jobId; // Extract jobId from the resolved object

  const { userId: clerkId } = await auth();

  if (!clerkId) redirect("/sign-in");

  // 🛠️ FIX: Map Clerk ID to internal user ID
  const userDoc = await db.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });

  if (!userDoc) {
    redirect("/");
  }

  const job = await db.job.findUnique({
    where: {
      id: jobId, // Use the extracted jobId here
      userId: userDoc.id, // Use internal ID here
    },
  });

  if (!job) {
    redirect("/admin/jobs");
  }

  const profiles = await db.userProfile.findMany({
    include: {
      resumes: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const jobs = await db.job.findMany({
    where: {
      userId: userDoc.id, // Use internal ID here too
    },
    include: {
      company: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const filteredProfiles = profiles.filter(profile =>
    profile.appliedJobs.some(
      (appliedJob) => appliedJob.jobId === jobId // Use the extracted jobId here
    )
  );

  const formattedProfiles: ApplicantsColumns[] = filteredProfiles.map(profile => ({
    id: profile.userId,
    fullname: profile.fullName || "",
    email: profile.email || "",
    contact: profile.contact || "",
    appliedAt: profile.appliedJobs.find(job => job.jobId === jobId)?.appliedAt // Use the extracted jobId here
      ? format(new Date(profile.appliedJobs.find(job => job.jobId === jobId)?.appliedAt ?? ""), "dd MMMM yyyy") // And here
      : "",
    resume: profile.resumes[0]?.url || "",
    resumeName: profile.resumes[0]?.name || "",
  }));

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