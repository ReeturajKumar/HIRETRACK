import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import getDb from "@/lib/db";

export const PATCH = async (req: Request) => {
  try {
    const { userId: clerkId } = await auth();
    const values = await req.json();

    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

    const db = await getDb();
    const existing = await db.collection("UserProfile").findOne({ userId: clerkId });

    let userProfile;
    if (existing) {
      userProfile = await db.collection("UserProfile").findOneAndUpdate(
        { userId: clerkId },
        { $set: { ...values } },
        { returnDocument: "after" }
      );
    } else {
      await db.collection("UserProfile").insertOne({
        userId: clerkId,
        appliedJobs: [],
        ...values,
      });
      userProfile = await db.collection("UserProfile").findOne({ userId: clerkId });
    }

    return NextResponse.json(userProfile);
  } catch (error) {
    console.log(`[USER_PROFILE_PATCH] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
