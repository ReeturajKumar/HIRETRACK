import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{
    userId: string;
  }>;
}

// Create a new resume for a user
export const POST = async (req: Request, { params }: Params) => {
  try {
    const { userId: clerkId } = await auth();
     const awaitedParams = await params; // ADD THIS LINE
    const { userId } = awaitedParams; 
    const { name, url } = await req.json();

    if (!clerkId || clerkId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name || !url) {
      return new NextResponse("Name and URL are required", { status: 400 });
    }

    const resume = await db.resumes.create({
      data: {
        name,
        url,
        userProfileId: userId,
      },
    });

    return NextResponse.json(resume, { status: 201 });
  } catch (error) {
    console.error("[POST_RESUME]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// Get all resumes for a user
export const GET = async (_req: Request, { params }: Params) => {
  try {
      const awaitedParams = await params; // ADD THIS LINE
    const { userId } = awaitedParams; 

    const resumes = await db.resumes.findMany({
      where: {
        userProfileId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(resumes);
  } catch (error) {
    console.error("[GET_ALL_RESUMES]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
