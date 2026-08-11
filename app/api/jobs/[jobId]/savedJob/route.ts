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

    const job = await db.collection("Job").findOne({ _id: new ObjectId(jobId) });
    if (!job) return new NextResponse("Job not found", { status: 404 });

    const result = await db.collection("Job").findOneAndUpdate(
      { _id: new ObjectId(jobId) },
      { $addToSet: { savedUsers: clerkId }, $set: { updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    return NextResponse.json({ ...result, id: result?._id.toString() });
  } catch (error) {
    console.log(`[JOB_SAVE_PATCH] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
