import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import getDb from "@/lib/db";

export const PATCH = async (req: Request) => {
  try {
    const { userId: clerkId } = await auth();
    const jobId = await req.text();

    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });
    if (!jobId) return new NextResponse("Job ID is required", { status: 400 });

    const db = await getDb();
    const profile = await db.collection("UserProfile").findOne({ userId: clerkId });
    if (!profile) return new NextResponse("Profile not found", { status: 404 });

    const updatedProfile = await db.collection("UserProfile").findOneAndUpdate(
      { userId: clerkId },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { $push: { appliedJobs: { jobId, appliedAt: new Date() } } as any },
      { returnDocument: "after" }
    );

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.log(`[APPLY_PATCH] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
