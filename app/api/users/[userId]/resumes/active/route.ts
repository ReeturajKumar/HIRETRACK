// /api/users/[userId]/resumes/active/route.ts

import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{
    userId: string;
  }>;
}

export const PATCH = async (req: Request, { params }: Params) => {
  try {
     const awaitedParams = await params; // ADD THIS LINE
    const { userId } = awaitedParams; 
    const { userId: clerkId } = await auth();

    if (!clerkId || clerkId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { resumes } = body;

    if (!Array.isArray(resumes)) {
      return new NextResponse("Invalid resumes format", { status: 400 });
    }

    // Delete all current resumes
    await db.resumes.deleteMany({
      where: {
        userProfileId: userId,
      },
    });

    // Insert new resumes
    const created = await db.$transaction(
      resumes.map((resume) =>
        db.resumes.create({
          data: {
            name: resume.name,
            url: resume.url,
            userProfileId: userId,
          },
        })
      )
    );

    return NextResponse.json(created);
  } catch (error) {
    console.error("[PATCH_USER_RESUMES]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
