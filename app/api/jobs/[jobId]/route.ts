import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


interface Params {
  params: Promise<{ // <-- THIS IS ALREADY CORRECT for PATCH
    jobId: string;
  }>;
}

export const PATCH = async (req: Request, { params }: Params) => {
  try {
    const { userId: clerkId } = await auth();
    const awaitedParams = await params;
    const { jobId } = awaitedParams;

    const updatedValues = await req.json();

    if (!clerkId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!jobId) {
      return new NextResponse("ID is required", { status: 400 });
    }

    // Retrieve MongoDB userId using clerkId
    const user = await db.user.findUnique({
      where: {
        clerkId,  // Use clerkId to fetch MongoDB _id
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const job = await db.job.update({
      where: {
        id: jobId,
        userId: user.id,  // Use MongoDB _id here
      },
      data: {
        ...updatedValues,
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.log(`[JOB_PATCH] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};


// --- IMPORTANT CHANGE HERE FOR DELETE METHOD ---
// Use the 'Params' interface you already defined, and await params inside the function.
export const DELETE = async (req: Request, { params }: Params) => { // Changed '{ params: { jobId: string } }' to 'Params'
  try {
    const { userId: clerkId } = await auth();
    
    // Await params here, just like in PATCH
    const awaitedParams = await params; 
    const { jobId } = awaitedParams; // Destructure from the awaited object

    if (!clerkId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!jobId) {
      return new NextResponse("ID is required", { status: 400 });
    }

    const user = await db.user.findUnique({
      where: {
        clerkId,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Check if the job belongs to the user
    const job = await db.job.findUnique({
      where: {
        id: jobId,
      },
    });

    if (!job || job.userId !== user.id) {
      return new NextResponse("Job not found or unauthorized", { status: 404 });
    }

    // Now delete
    const deletedJob = await db.job.delete({
      where: {
        id: jobId,
      },
    });

    return NextResponse.json(deletedJob);

  } catch (error) {
    console.log(`[JOB_DELETE] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};