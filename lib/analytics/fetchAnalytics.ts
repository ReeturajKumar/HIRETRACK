// lib/analytics/fetchAnalytics.ts (NEW FILE)

import { getTotalCompaniesOnPortal, getTotalCompaniesOnPortalByUserId, getTotalJobsOnPortal, getTotalJobsOnPortalByUserId } from "@/actions/get-overview-analytic";
import { currentUser } from "@clerk/nextjs/server";

export const fetchAnalytics = async () => {
  const user = await currentUser();
  const clerkId = user?.id || null;

  const [
    totalJobs,
    userJobs,
  ] = await Promise.all([
    getTotalJobsOnPortal(),
    getTotalJobsOnPortalByUserId(clerkId),
  ]);
  const totalCompanies = await getTotalCompaniesOnPortal();
  const userCompanies = await getTotalCompaniesOnPortalByUserId(clerkId);


  return [
    { name: "Total Jobs", value: totalJobs },
    { name: "Your Jobs", value: userJobs },
    { name: "Total Companies", value: totalCompanies },
    { name: "Your Companies", value: userCompanies },
  ];
};
