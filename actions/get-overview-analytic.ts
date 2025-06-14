import db from "@/lib/db";

export const getTotalJobsOnPortal = async () => {
  const jobs = await db.job.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return jobs.length;
};

export const getTotalJobsOnPortalByUserId = async (clerkId: string | null) => {
  if (!clerkId) return 0;

  const user = await db.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });

  if (!user) return 0;

  const jobs = await db.job.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return jobs.length;
};

export const getTotalCompaniesOnPortal = async () => {
  const companies = await db.company.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return companies.length;
};

export const getTotalCompaniesOnPortalByUserId = async (
  clerkId: string | null
) => {
  if (!clerkId) return 0;

  const user = await db.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });

  if (!user) return 0;

  const companies = await db.company.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return companies.length;
};
