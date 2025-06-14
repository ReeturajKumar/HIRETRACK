import {
  getTotalCompaniesOnPortal,
  getTotalCompaniesOnPortalByUserId,
  getTotalJobsOnPortal,
  getTotalJobsOnPortalByUserId,
} from "@/actions/get-overview-analytic";
import Box from "@/components/box";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { auth } from "@clerk/nextjs/server";
import {
  BriefcaseBusiness,
  CalendarCheck,
  Handshake,
  User,
} from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import { fetchAnalytics } from "@/lib/analytics/fetchAnalytics";
import OverviewBarChart from "./_components/overview-chart";

const DashboardAnalyticsPage = async () => {
  const { userId: clerkId } = await auth();
  if (!clerkId) return redirect("/");

  const totalJobsOnPortal = await getTotalJobsOnPortal();
  const totalJobsOnPortalByUser = await getTotalJobsOnPortalByUserId(clerkId);
  const totalCompaniessOnPortal = await getTotalCompaniesOnPortal();
  const totalCompaniesOnPortalByUser = await getTotalCompaniesOnPortalByUserId(
    clerkId
  );

  const data = await fetchAnalytics();
  const companyData = data.filter(d => d.name.includes("Companies"));

   const jobData = data.filter(d => d.name.includes("Job"));

  // console.log("Company Data:", companyData);
  return (
    <Box className="flex-col items-start p-4">
      <div className="flex flex-col items-start">
        <h2 className="font-sans text-2xl text-neutral-600 dark:text-white tracking-wider font-semibold">
          Analytics Dashboard
        </h2>
        <p>Overview Of Your Job Postings & Account</p>
      </div>

      <Separator className="my-4" />

      <div className="grid gap-5 w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <Card className="w-full bg-white dark:bg-[#141416] border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">
              Number of Job Postings
            </CardTitle>
            <BriefcaseBusiness className="w-4 h-4 text-gray-900 dark:text-white" />
          </CardHeader>

          <CardContent className="text-2xl font-bold">
            {totalJobsOnPortal}
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="w-full bg-white dark:bg-[#141416] border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">
              Job Postings By You
            </CardTitle>
            <User className="w-4 h-4 text-gray-900 dark:text-white" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {totalJobsOnPortalByUser}
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="w-full bg-white dark:bg-[#141416] border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">
              Number of Companies
            </CardTitle>
            <CalendarCheck className="w-4 h-4 text-gray-900 dark:text-white" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {totalCompaniessOnPortal}
          </CardContent>
        </Card>

        {/* Card 4 */}
        <Card className="w-full bg-white dark:bg-[#141416] border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">
              Companies Created By You
            </CardTitle>
            <Handshake className="w-4 h-4 text-gray-900 dark:text-white" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {totalCompaniesOnPortalByUser}
          </CardContent>
        </Card>

        <Card className=" col-span-1 md:col-span-2 w-full bg-white dark:bg-[#141416] border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">
              Total Jobs
            </CardTitle>
          </CardHeader>
           <OverviewBarChart data={jobData} />
        </Card>

        <Card className=" col-span-1 md:col-span-2 w-full bg-white dark:bg-[#141416] border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">
              Total Companies
            </CardTitle>
          </CardHeader>
           <OverviewBarChart data={companyData} />
        </Card>
      </div>
    </Box>
  );
};

export default DashboardAnalyticsPage;
