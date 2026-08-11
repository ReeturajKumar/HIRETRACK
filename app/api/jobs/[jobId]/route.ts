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
    const updatedValues = await req.json();

    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });
    if (!jobId) return new NextResponse("ID is required", { status: 400 });

    const db = await getDb();
    const mongoUser = await db.collection("User").findOne({ clerkId });
    if (!mongoUser) return new NextResponse("User not found", { status: 404 });

    const result = await db.collection("Job").findOneAndUpdate(
      { _id: new ObjectId(jobId), userId: mongoUser._id.toString() },
      { $set: { ...updatedValues, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    if (!result) return new NextResponse("Job not found", { status: 404 });
    return NextResponse.json({ ...result, id: result._id.toString() });
  } catch (error) {
    console.log(`[JOB_PATCH] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (req: Request, { params }: Params) => {
  try {
    const { userId: clerkId } = await auth();
    const { jobId } = await params;

    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });
    if (!jobId) return new NextResponse("ID is required", { status: 400 });

    const db = await getDb();
    const mongoUser = await db.collection("User").findOne({ clerkId });
    if (!mongoUser) return new NextResponse("User not found", { status: 404 });

    const job = await db.collection("Job").findOne({ _id: new ObjectId(jobId) });
    if (!job || job.userId !== mongoUser._id.toString()) {
      return new NextResponse("Job not found or unauthorized", { status: 404 });
    }

    await db.collection("Job").deleteOne({ _id: new ObjectId(jobId) });
    return NextResponse.json({ ...job, id: job._id.toString() });
  } catch (error) {
    console.log(`[JOB_DELETE] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};