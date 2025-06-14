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
    const { userId: clerkId } = await auth();
     const awaitedParams = await params; // ADD THIS LINE
    const { jobId } = awaitedParams;

    if (!jobId) return new NextResponse("ID is required", { status: 400 });
    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

    const user = await db.user.findUnique({ where: { clerkId } });
    if (!user) return new NextResponse("User not found", { status: 404 });

    const job = await db.job.findUnique({ where: { id: jobId } });
    if (!job) return new NextResponse("Job not found", { status: 404 });

    const updatedJob = await db.job.update({
      where: { id: jobId },
      data: {
       savedUsers: {
  set: Array.from(new Set([...(job.savedUsers || []), clerkId])),
}

      },
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.log(`[JOB_PUBLISH_PATCH] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
