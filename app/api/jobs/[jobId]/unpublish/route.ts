import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { ObjectId } from "mongodb";

interface Params {
  params: Promise<{ jobId: string }>;
}

export const PATCH = async (req: Request, { params }: Params) => {
  try {
    const { userId: clerkId } = await auth();
    const { jobId } = await params;

    if (!jobId) return new NextResponse("ID is required", { status: 400 });
    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

    const db = await getDb();
    const mongoUser = await db.collection("User").findOne({ clerkId });
    if (!mongoUser) return new NextResponse("User not found", { status: 404 });

    const job = await db.collection("Job").findOne({
      _id: new ObjectId(jobId),
      userId: mongoUser._id.toString(),
    });
    if (!job) return new NextResponse("Job not found", { status: 404 });

    const result = await db.collection("Job").findOneAndUpdate(
      { _id: new ObjectId(jobId) },
      { $set: { isPublished: false, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    return NextResponse.json({ ...result, id: result?._id.toString() });
  } catch (error) {
    console.log(`[JOB_UNPUBLISH_PATCH] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
