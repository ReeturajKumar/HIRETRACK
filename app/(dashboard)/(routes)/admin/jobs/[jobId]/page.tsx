
import getDb from "@/lib/db";
import { serialize, serializeArray } from "@/lib/serialize";
import { ObjectId } from "mongodb";
import { Category, Job, Company } from "@/lib/types/models";
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

type JobDetailsPageProps = {
  params: Promise<{ jobId: string }>;
};

const JobDetailsPage = async ({ params }: JobDetailsPageProps) => {
  const { jobId } = await params;

  const validateObjectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!validateObjectIdRegex.test(jobId)) return redirect("/admin/jobs");

  const { userId: clerkId } = await auth();
  if (!clerkId) return redirect("/");

  const db = await getDb();

  const mongoUser = await db.collection("User").findOne({ clerkId });
  if (!mongoUser) return redirect("/");

  const jobDoc = await db.collection("Job").findOne({
    _id: new ObjectId(jobId),
    userId: mongoUser._id.toString(),
  });

  const categoriesDocs = await db.collection("Category").find({}).sort({ name: 1 }).toArray();
  const categories = serializeArray(categoriesDocs.map((c) => ({ ...c, id: c._id.toString() }))) as unknown as Category[];

  const companiesDocs = await db
    .collection("Company")
    .find({ userId: mongoUser._id.toString() })
    .sort({ createdAt: -1 })
    .toArray();
  const companies = serializeArray(companiesDocs.map((c) => ({ ...c, id: c._id.toString() }))) as unknown as Company[];

  if (!jobDoc) return redirect("/admin/jobs");

  const job = serialize({ ...jobDoc, id: jobDoc._id.toString() }) as unknown as Job;

  const requiredFields = [job.title, job.description, job.imageUrl, job.categoryId];
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
        <JobPublishAction JobId={job.id} isPublished={job.isPublished} disabled={!isComplete} />
      </div>

      {!job.isPublished && (
        <Banner variant="warning" label="This job is unpublished. It will not be visible to candidates"></Banner>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-3">
            <IconBadge icon={LayoutDashboard} iconClassName="dark:text-white" />
            <h2 className="text-xl font-medium">Customize Your Job</h2>
          </div>
          <TitleForm initialData={job} jobId={job.id} />
          <CategoryForm initialData={job} jobId={job.id} options={categories.map((c) => ({ value: c.id, label: c.name }))} />
          <ImageForm initialData={job} jobId={job.id} />
          <ShortDescriptionForm initialData={job} jobId={job.id} />
          <ShiftTimingMode initialData={job} jobId={job.id} />
          <SalaryRangeForm initialData={job} jobId={job.id} />
          <JobMode initialData={job} jobId={job.id} />
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
            <CompanyForm initialData={job} jobId={job.id} options={companies.map((c) => ({ value: c.id, label: c.name }))} />
          </div>

          <div>
            <div className="flex items-center gap-x-3">
              <IconBadge icon={File} iconClassName="dark:text-white" />
              <h2 className="text-xl font-medium">Job Resources & Attachments</h2>
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