// app/api/jobs/[jobId]/savedJob/route.ts (Unsave Logic)

import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface Params {
 params: Promise<{ 
    jobId: string;
  }>;
}

export const PATCH = async (req: Request, { params }: Params) => {
  try {
    const { userId: clerkId } = await auth(); // This is the Clerk ID

    const awaitedParams = await params;
    const { jobId } = awaitedParams;

    if (!jobId) {
      return new NextResponse("ID is required", { status: 400 });
    }
    if (!clerkId) { // Check if clerkId exists, not just userId
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // You might not even need to fetch the full 'user' object if you're storing Clerk IDs directly.
    // However, if your 'savedUsers' *does* store your internal db.user.id, then you'd need this user lookup.
    const user = await db.user.findUnique({
      where: {
        clerkId: clerkId, // Use clerkId to find the user
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const job = await db.job.findUnique({
      where: {
        id: jobId,
      },
    });

    if (!job) {
      return new NextResponse("Job not found", { status: 404 });
    }

    // Filter by the Clerk ID that comes from auth(),
    // if your `job.savedUsers` array stores Clerk IDs.
    // Otherwise, if it stores your internal db.user.id, keep `user.id`.
    const updatedJob = await db.job.update({
      where: {
        id: jobId,
      },
      data: {
        savedUsers: {
          // If job.savedUsers stores Clerk IDs:
          set: job.savedUsers.filter((savedUserId) => savedUserId !== clerkId),
          // OR, if job.savedUsers stores your internal db.user.id (less common with direct Clerk integration for arrays):
          // set: job.savedUsers.filter((savedUserId) => savedUserId !== user.id), // Your original line
        },
      },
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.log(`[JOB_UNSAVE_PATCH] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};