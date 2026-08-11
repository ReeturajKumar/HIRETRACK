import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import getDb from "@/lib/db";

interface Params {
  params: Promise<{ userId: string }>;
}

// Create a new resume for a user
export const POST = async (req: Request, { params }: Params) => {
  try {
    const { userId: clerkId } = await auth();
    const { userId } = await params;
    const { name, url } = await req.json();

    if (!clerkId || clerkId !== userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!name || !url) return new NextResponse("Name and URL are required", { status: 400 });

    const db = await getDb();
    const now = new Date();
    const result = await db.collection("Resumes").insertOne({
      name,
      url,
      userProfileId: userId,
      createdAt: now,
      updatedAt: now,
    });

    const resume = await db.collection("Resumes").findOne({ _id: result.insertedId });
    return NextResponse.json({ ...resume, id: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    console.error("[POST_RESUME]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// Get all resumes for a user
export const GET = async (_req: Request, { params }: Params) => {
  try {
    const { userId } = await params;

    const db = await getDb();
    const resumes = await db
      .collection("Resumes")
      .find({ userProfileId: userId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(resumes.map((r) => ({ ...r, id: r._id.toString() })));
  } catch (error) {
    console.error("[GET_ALL_RESUMES]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
