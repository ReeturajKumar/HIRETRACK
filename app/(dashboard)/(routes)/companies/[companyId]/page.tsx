import Box from "@/components/box";
import { CustomeBreadCrummb } from "@/components/CustomeBreadCrummb";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import CompnayDetailsPageContent from "./_components/COmpnayDetailsPAgeContent";


interface CompanyDetailsPageProps {
  // THIS IS THE CRITICAL CHANGE: params should be typed solely as a Promise
  params: Promise<{
    companyId: string;
  }>;
}

const CompanyDetailsPage = async({ params }: CompanyDetailsPageProps) => {
  // This line correctly awaits the params Promise
  const awaitedParams = await params;
  const { companyId } = awaitedParams;
  const {userId: clerkId} = await auth();

  if(!clerkId) {
    console.log("unauthorized")
  }

  const company = await db.company.findUnique({
    where: {
      id: companyId, // Use the destructured companyId
    },
  })

  if(!company) {
    redirect("/")
  }

  const jobs = await db.job.findMany({
    where: {
      companyId: companyId, // Use the destructured companyId
    },
    include: {
      company: true
    },
    orderBy: {
      createdAt: "desc",
    }
  })
  return (
    <div className="flex-col">
      <Box className="mt-4 items-center justify-start gap-2 mb-4 px-2">
        <CustomeBreadCrummb 
        breadCrumbPage={company?.name !== undefined ? company?.name : ""} 
        createCrumbItem={[{label: "Search", link:"/search"}]}/>
      </Box>


      {company?.coverImage && (
        <div className="w-full flex items-center justify-center overflow-hidden relative h-80 -z-10">
          <Image
          alt={company?.name !== undefined ? company?.name : ""}
            src={company?.coverImage}
            fill
            className="w-full h-full object-cover"
          />
        </div>
      )}


      <CompnayDetailsPageContent userId={clerkId} company={company} jobs={jobs}/>
    </div>
  )
}

export default CompanyDetailsPage