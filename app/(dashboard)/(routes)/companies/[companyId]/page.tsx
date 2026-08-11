
import getDb from "@/lib/db";
import { serialize, serializeArray } from "@/lib/serialize";
import { ObjectId } from "mongodb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Company, Job } from "@/lib/types/models";
import Box from "@/components/box";
import { CustomeBreadCrummb } from "@/components/CustomeBreadCrummb";
import CompnayDetailsPageContent from "./_components/COmpnayDetailsPAgeContent";

interface CompanyDetailsPageProps {
  params: Promise<{ companyId: string }>;
}

const CompanyDetailsPage = async ({ params }: CompanyDetailsPageProps) => {
  const { companyId } = await params;
  const { userId: clerkId } = await auth();

  if (!clerkId) console.log("unauthorized");

  const db = await getDb();
  const companyDoc = await db.collection("Company").findOne({ _id: new ObjectId(companyId) });
  if (!companyDoc) redirect("/");

  const company = serialize({ ...companyDoc, id: companyDoc._id.toString() }) as unknown as Company;

  const jobsDocs = await db
    .collection("Job")
    .find({ companyId })
    .sort({ createdAt: -1 })
    .toArray();

  const jobs = serializeArray(await Promise.all(
    jobsDocs.map(async (job) => {
      return { ...job, id: job._id.toString(), company };
    })
  )) as unknown as Job[];

  return (
    <div className="flex-col">
      <Box className="mt-4 items-center justify-start gap-2 mb-4 px-2">
        <CustomeBreadCrummb
          breadCrumbPage={company?.name ?? ""}
          createCrumbItem={[{ label: "Search", link: "/search" }]}
        />
      </Box>

      {(company?.coverImage && company.coverImage.trim() !== "") && (
        <div className="w-full flex items-center justify-center overflow-hidden relative h-80 -z-10">
          <Image
            alt={company?.name ?? ""}
            src={company?.coverImage}
            fill
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <CompnayDetailsPageContent userId={clerkId} company={company as any} jobs={jobs as any} />
    </div>
  );
};

export default CompanyDetailsPage;