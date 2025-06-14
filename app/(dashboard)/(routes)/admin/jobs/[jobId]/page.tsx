import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowLeft,
  Building2,
  File,
  LayoutDashboard,
  ListCheck,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { JobPublishAction } from "./_components/JobPublishction";
import { Banner } from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";
import TitleForm from "./_components/TitleForm";
import CategoryForm from "./_components/CategoryForm";
import ImageForm from "./_components/ImageForm";
import ShortDescriptionForm from "./_components/ShortDescription";
import ShiftTimingMode from "./_components/ShiftTimingMode";
import SalaryRangeForm from "./_components/SalaryRange";
import JobMode from "./_components/JobMode";
import WorkExperience from "./_components/WorkExperience";
import JobDescriptionForm from "./_components/JobDescription";
import TagsForm from "./_components/TagsForm";
import CompanyForm from "./_components/CompanyForm";
import AttachmentsForm from "./_components/AttachmentsForm";

// --- CRUCIAL CHANGE 1: Define the type for params as a Promise ---
type JobDetailsPageProps = {
  params: Promise<{
    jobId: string;
  }>;
};

// Update the component's signature to use the correct type
const JobDetailsPage = async ({ params }: JobDetailsPageProps) => {
  // --- CRUCIAL CHANGE 2: Await params to get the actual object ---
  const resolvedParams = await params;
  const jobId = resolvedParams.jobId; // Extract jobId from the resolved object

  const validateObjectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!validateObjectIdRegex.test(jobId)) { // Use the extracted jobId here
    return redirect("/admin/jobs");
  }

  const { userId: clerkId } = await auth(); // Get Clerk userId (clerkId)
  if (!clerkId) {
    return redirect("/"); // Redirect if user is not authenticated
  }

  // Retrieve MongoDB userId using clerkId
  const user = await db.user.findUnique({
    where: {
      clerkId, // Using clerkId to fetch MongoDB _id
    },
  });

  if (!user) {
    return redirect("/"); // Redirect if the user is not found in MongoDB
  }

  const job = await db.job.findUnique({
    where: {
      id: jobId, // Use the extracted jobId here
      userId: user.id, // Use MongoDB user _id here
    },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const companies = await db.company.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!job) {
    return redirect("/admin/jobs"); // Redirect if the job is not found
  }

  const requiredFields = [
    job.title,
    job.description,
    job.imageUrl,
    job.categoryId,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `${completedFields} / ${totalFields}`;

  const isComplete = requiredFields.every(Boolean);
  return (
    <div className="p-6">
      <Link href="/admin/jobs">
        <div className="flex items-center gap-3 text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
          Back
        </div>
      </Link>

      <div className="flex items-center justify-between my-4">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Job SetUp</h1>
          <span className="text-muted-foreground text-sm">
            Complete All Fields: {completionText}
          </span>
        </div>

        {/* Fetching the job status */}
        <JobPublishAction
          JobId={job.id} // Use job.id since the job object is already fetched
          isPublished={job.isPublished}
          disabled={!isComplete}
        />
      </div>

      {/* banner warning and success */}
      {!job.isPublished && (
        <Banner
          variant="warning"
          label="This job is unpublished. It will not be visible to candidates"
        ></Banner>
      )}

      {/* container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-3">
            <IconBadge icon={LayoutDashboard} iconClassName="dark:text-white" />

            <h2 className="text-xl font-medium">Customize Your Job</h2>
          </div>
          <TitleForm initialData={job} jobId={job.id} />

          {/* categories */}
          <CategoryForm
            initialData={job}
            jobId={job.id}
            options={categories.map((category) => ({
              value: category.id,
              label: category.name,
            }))}
          />

          {/* cover image */}
          <ImageForm initialData={job} jobId={job.id} />

          {/* description */}
          <ShortDescriptionForm initialData={job} jobId={job.id} />

          {/* shift timing mode */}
          <ShiftTimingMode initialData={job} jobId={job.id} />

          {/* salary range */}
          <SalaryRangeForm initialData={job} jobId={job.id} />

          {/* job mode */}
          <JobMode initialData={job} jobId={job.id} />

          {/* Work */}
          <WorkExperience initialData={job} jobId={job.id} />
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-3">
              <IconBadge icon={ListCheck} iconClassName="dark:text-white" />
              <h2 className="text-xl font-medium">Job Requirements</h2>
            </div>
            <TagsForm initialData={job} jobId={job.id} />
          </div>

          <div>
            <div className="flex items-center gap-x-3">
              <IconBadge icon={Building2} iconClassName="dark:text-white" />
              <h2 className="text-xl font-medium">Company Details</h2>
            </div>
            <CompanyForm
              initialData={job}
              jobId={job.id}
              options={companies.map((company) => ({
                value: company.id,
                label: company.name,
              }))}
            />
          </div>

          <div>
            <div className="flex items-center gap-x-3">
              <IconBadge icon={File} iconClassName="dark:text-white" />
              <h2 className="text-xl font-medium">
                Job Resources & Attachments
              </h2>
            </div>
            <AttachmentsForm initialData={job} jobId={job.id} />
          </div>
        </div>

        <div className="col-span-2">
          <JobDescriptionForm initialData={job} jobId={job.id} />
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;