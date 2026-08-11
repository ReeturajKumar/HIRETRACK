import getDb from "@/lib/db";

export const getTotalJobsOnPortal = async () => {
  const db = await getDb();
  return db.collection("Job").countDocuments();
};

export const getTotalJobsOnPortalByUserId = async (clerkId: string | null) => {
  if (!clerkId) return 0;

  const db = await getDb();
  const mongoUser = await db.collection("User").findOne({ clerkId });
  if (!mongoUser) return 0;

  return db.collection("Job").countDocuments({ userId: mongoUser._id.toString() });
};

export const getTotalCompaniesOnPortal = async () => {
  const db = await getDb();
  return db.collection("Company").countDocuments();
};

export const getTotalCompaniesOnPortalByUserId = async (clerkId: string | null) => {
  if (!clerkId) return 0;

  const db = await getDb();
  const mongoUser = await db.collection("User").findOne({ clerkId });
  if (!mongoUser) return 0;

  return db.collection("Company").countDocuments({ userId: mongoUser._id.toString() });
};
