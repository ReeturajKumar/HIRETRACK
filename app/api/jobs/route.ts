import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import getDb from "@/lib/db";

export const POST = async (req: Request) => {
  try {
    const { userId: clerkId } = await auth();
    const { title } = await req.json();

    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });
    if (!title) return new NextResponse("Title is required", { status: 400 });

    const db = await getDb();
    const mongoUser = await db.collection("User").findOne({ clerkId });
    if (!mongoUser) return new NextResponse("User not found", { status: 404 });

    const now = new Date();
    const result = await db.collection("Job").insertOne({
      userId: mongoUser._id.toString(),
      title,
      isPublished: false,
      tags: [],
      savedUsers: [],
      createdAt: now,
      updatedAt: now,
    });

    const job = await db.collection("Job").findOne({ _id: result.insertedId });
    return NextResponse.json({ ...job, id: result.insertedId.toString() });
  } catch (error) {
    console.log(`[JOB_POST] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
