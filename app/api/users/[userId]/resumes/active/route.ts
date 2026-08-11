// /api/users/[userId]/resumes/active/route.ts

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import getDb from "@/lib/db";

interface Params {
  params: Promise<{ userId: string }>;
}

export const PATCH = async (req: Request, { params }: Params) => {
  try {
    const { userId } = await params;
    const { userId: clerkId } = await auth();

    if (!clerkId || clerkId !== userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { resumes } = body;

    if (!Array.isArray(resumes)) return new NextResponse("Invalid resumes format", { status: 400 });

    const db = await getDb();
    const now = new Date();

    // Delete all current resumes for this user
    await db.collection("Resumes").deleteMany({ userProfileId: userId });

    // Insert new resumes
    const docs = resumes.map((resume: { name: string; url: string }) => ({
      name: resume.name,
      url: resume.url,
      userProfileId: userId,
      createdAt: now,
      updatedAt: now,
    }));

    let created: any[] = [];
    if (docs.length > 0) {
      const result = await db.collection("Resumes").insertMany(docs);
      created = await db
        .collection("Resumes")
        .find({ _id: { $in: Object.values(result.insertedIds) } })
        .toArray();
    }

    const result = created.map((r) => ({ ...r, id: r._id.toString() }));
    return NextResponse.json(result);
  } catch (error) {
    console.error("[PATCH_USER_RESUMES]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
