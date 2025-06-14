

import Box from "@/components/box";
import { CustomeBreadCrummb } from "@/components/CustomeBreadCrummb";
import { auth, currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import NameForm from "./_components/name-form";
import db from "@/lib/db";
import EmailForm from "./_components/email-form";
import ContactForm from "./_components/contact-form";
import ResumeForm from "./_components/resume-form";
import { DataTable } from "@/components/ui/data-table";
import { format } from "date-fns";
import { AppliedJobscolumns, columns } from "./_components/column";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const ProfilePage = async () => {
  const { userId: clerkId } = await auth();
  const user = await currentUser();

  if (!clerkId) redirect("/sign-in");

  const profile = await db.userProfile.findUnique({
    where: { userId: clerkId },
    include: {
      resumes: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const appliedJobIds = profile?.appliedJobs.map((aj) => aj.jobId) || [];

  const appliedJobsFromDB = await db.job.findMany({
    where: {
      id: { in: appliedJobIds },
    },
    include: {
      company: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedJobs: AppliedJobscolumns[] = appliedJobsFromDB.map((job) => {
    const matched = profile?.appliedJobs.find((aj) => aj.jobId === job.id);
    return {
      id: job.id,
      title: job.title,
      company: job.company?.name || "",
      category: job.category?.name || "",
      appliedAt: matched?.appliedAt
        ? format(new Date(matched.appliedAt), "MMMM do yyyy")
        : "Unknown",
    };
  });

  const followedCompnies = await db.company.findMany({
    where: {
      followers: {
        has: clerkId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex flex-col p-4 md:p-8 items-center">
      <Box>
        <CustomeBreadCrummb breadCrumbPage="My Profile" createCrumbItem={[]} />
      </Box>

      <Box className="flex-col p-4 rounded-md border mt-8 w-full space-y-6">
        {user?.hasImage && (
          <div className="aspect-square w-24 h-24 rounded-full shadow-md">
            <Image
              width={100}
              height={100}
              src={user.imageUrl}
              alt="Profile"
              className="w-full h-full rounded-full"
            />
          </div>
        )}

        <NameForm
          initialData={profile}
          clerkId={clerkId}
          clerkName={user?.fullName || ""}
        />
        <EmailForm
          initialData={profile}
          clerkId={clerkId}
          clerkEmail={user?.emailAddresses?.[0]?.emailAddress || ""}
        />
        <ContactForm initialData={profile} clerkId={clerkId} />
        <ResumeForm initialData={profile} clerkId={clerkId} />
      </Box>

      <Box className="flex-col items-start justify-start mt-12 w-full">
        <h2 className="text-2xl text-muted-foreground font-semibold">
          Applied Jobs
        </h2>

        <div className="w-full mt-6">
          <DataTable
            columns={columns}
            searchKey="company"
            data={formattedJobs}
          />
        </div>
      </Box>

      <Box className="flex flex-col items-start justify-start mt-12 w-full">
        <h2 className="text-2xl text-muted-foreground font-semibold mb-4">
          Followed Companies
        </h2>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {followedCompnies.length === 0 ? (
            <p className="text-muted-foreground col-span-full">
              No followed companies
            </p>
          ) : (
            followedCompnies.map((company) => (
              <Card
                key={company.id}
                className="border rounded-xl shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow w-full"
              >
                {company.logo && (
                  <div className="w-full h-24 flex items-center justify-center relative overflow-hidden rounded-md">
                    <Image
                      fill
                      src={company.logo}
                      alt="Company Logo"
                      className="object-contain w-full h-full"
                    />
                  </div>
                )}
                <CardTitle className="text-lg font-semibold">
                  {company.name}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground line-clamp-5">
                  {company.description}
                </CardDescription>
              </Card>
            ))
          )}
        </div>
      </Box>
    </div>
  );
};

export default ProfilePage;
