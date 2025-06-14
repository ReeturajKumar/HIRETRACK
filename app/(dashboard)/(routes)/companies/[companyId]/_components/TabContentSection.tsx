"use client";

import { Company, Job } from "@/lib/generated/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompanyPreview from './../../../admin/companies/[companyId]/_components/CompanyPreview';
import CompanyPreviewWhyJoinUs from "../../../admin/companies/[companyId]/_components/CompanyPreviewJoinUs";
import JobsTabsContent from "./JobsTabsContent";

interface TabContentSectionProps {
  userId: string | null;
  company: Company;
  jobs: Job[];
}
const TabContentSection = ({
  userId,
  company,
  jobs,
}: TabContentSectionProps) => {
  return (
    <div className="w-full my-4 mt-12">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-transparent shadow-none">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:text-primary bg-transparent text-base font-sans tracking-wide px-6"
          >
            Overview
          </TabsTrigger>

          <TabsTrigger
            value="joinus"
            className="data-[state=active]:text-primary bg-transparent text-base font-sans tracking-wide px-6"
          >
            Why Join Us
          </TabsTrigger>

          <TabsTrigger
            value="jobs"
            className="data-[state=active]:text-primary bg-transparent text-base font-sans tracking-wide px-6 "
          >
            Jobs
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          {company.overview ? <CompanyPreview overview ={company.overview} /> : ""}
        </TabsContent>
        <TabsContent value="joinus">
           {company.whyJoinUs ? <CompanyPreviewWhyJoinUs whyJoinUs ={company.whyJoinUs} /> : ""}
        </TabsContent>

        <TabsContent value="jobs">
          <JobsTabsContent userId={userId} jobs={jobs}/>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TabContentSection;
