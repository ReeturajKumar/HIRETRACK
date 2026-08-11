
import Box from "@/components/box";
import { CustomeBreadCrummb } from "@/components/CustomeBreadCrummb";
import { auth, currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import NameForm from "./_components/name-form";
import getDb from "@/lib/db";
import { serialize, serializeArray } from "@/lib/serialize";
import { ObjectId } from "mongodb";
import EmailForm from "./_components/email-form";
import ContactForm from "./_components/contact-form";
import ResumeForm from "./_components/resume-form";
import { DataTable } from "@/components/ui/data-table";
import { format } from "date-fns";
import { AppliedJobscolumns, columns } from "./_components/column";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { UserProfile, Company } from "@/lib/types/models";

const ProfilePage = async () => {
  const { userId: clerkId } = await auth();
  const user = await currentUser();

  if (!clerkId) redirect("/sign-in");

  const db = await getDb();

  // Fetch user profile
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

  // Fetch applied jobs
  const appliedJobIds = (profile?.appliedJobs ?? []).map((aj) => aj.jobId);

  const appliedJobsFromDB = appliedJobIds.length > 0
    ? await db
        .collection("Job")
        .find({ _id: { $in: appliedJobIds.map((id: string) => new ObjectId(id)) } })
        .sort({ createdAt: -1 })
        .toArray()
    : [];

  const rawAppliedJobs = await Promise.all(
    appliedJobsFromDB.map(async (job) => {
      const company = job.companyId
        ? await db.collection("Company").findOne({ _id: new ObjectId(job.companyId) })
        : null;
      const category = job.categoryId
        ? await db.collection("Category").findOne({ _id: new ObjectId(job.categoryId) })
        : null;
      return { ...job, id: job._id.toString(), company, category };
    })
  );

  const enrichedAppliedJobs = serializeArray<any>(rawAppliedJobs);
  const formattedJobs: AppliedJobscolumns[] = enrichedAppliedJobs.map((job) => {
    const matched = profile?.appliedJobs.find((aj) => aj.jobId === job.id);
    return {
      id: job.id,
      title: job.title,
      company: job.company?.name || "",
      category: job.category?.name || "",
      appliedAt: matched?.appliedAt ? format(new Date(matched.appliedAt), "MMMM do yyyy") : "Unknown",
    };
  });

  // Fetch followed companies
  const followedCompaniesDocs = await db
    .collection("Company")
    .find({ followers: clerkId })
    .sort({ createdAt: -1 })
    .toArray();
  const followedCompanies = serializeArray<Company>(followedCompaniesDocs.map((c) => ({ ...c, id: c._id.toString() })));

  return (
    <div className="flex flex-col p-4 md:p-8 items-center">
      <Box>
        <CustomeBreadCrummb breadCrumbPage="My Profile" createCrumbItem={[]} />
      </Box>

      <Box className="flex-col p-4 rounded-md border mt-8 w-full space-y-6">
        {user?.hasImage && (
          <div className="aspect-square w-24 h-24 rounded-full shadow-md">
            <Image width={100} height={100} src={user.imageUrl} alt="Profile" className="w-full h-full rounded-full" />
          </div>
        )}

        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <NameForm initialData={profile as any} clerkId={clerkId} clerkName={user?.fullName || ""} />
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <EmailForm initialData={profile as any} clerkId={clerkId} clerkEmail={user?.emailAddresses?.[0]?.emailAddress || ""} />
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <ContactForm initialData={profile as any} clerkId={clerkId} />
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <ResumeForm initialData={profile as any} clerkId={clerkId} />
      </Box>

      <Box className="flex-col items-start justify-start mt-12 w-full">
        <h2 className="text-2xl text-muted-foreground font-semibold">Applied Jobs</h2>
        <div className="w-full mt-6">
          <DataTable columns={columns} searchKey="company" data={formattedJobs} />
        </div>
      </Box>

          <Box className="flex flex-col items-start justify-start mt-12 w-full">
        <h2 className="text-2xl text-muted-foreground font-semibold mb-4">Followed Companies</h2>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {followedCompanies.length === 0 ? (
            <p className="text-muted-foreground col-span-full">No followed companies</p>
          ) : (
            followedCompanies.map((company) => (
              <Card key={company.id} className="border rounded-xl shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow w-full">
                {company.logo && (
                  <div className="w-full h-24 flex items-center justify-center relative overflow-hidden rounded-md">
                    <Image fill src={company.logo} alt="Company Logo" className="object-contain w-full h-full" />
                  </div>
                )}
                <CardTitle className="text-lg font-semibold">{company.name}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground line-clamp-5">{company.description}</CardDescription>
              </Card>
            ))
          )}
        </div>
      </Box>
    </div>
  );
};

export default ProfilePage;
