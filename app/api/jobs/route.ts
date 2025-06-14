import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { userId: clerkId } = await auth();
    const { title } = await req.json();

    if (!clerkId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    const mongoUser = await db.user.findUnique({
      where: { clerkId },
    });

    if (!mongoUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const job = await db.job.create({
      data: {
        title,
        userId: mongoUser.id, // ✅ Use MongoDB ObjectId here
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.log(`[JOB_POST] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
