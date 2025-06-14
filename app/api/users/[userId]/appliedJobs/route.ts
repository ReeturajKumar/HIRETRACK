import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request) => {


  try {
    const { userId: clerkId } = await auth();
    const jobId = await req.text();

    if (!clerkId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!jobId) {
      return new NextResponse("Job ID is required", { status: 400 });
    }

    const profile = await db.userProfile.findUnique({
      where: {
        userId: clerkId,
      },
    });

    if (!profile) {
      return new NextResponse("Profile not found", { status: 404 });
    }

    const updatedProfile = await db.userProfile.update({
      where: {
        userId: clerkId,
      },
      data: {
        appliedJobs: {
          push: {
          jobId,
          },
        },
      },
    })

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.log(`[APPLY_PATCH] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

