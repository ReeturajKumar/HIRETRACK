import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import getDb from "@/lib/db";

export const POST = async (req: Request) => {
  try {
    const { userId: clerkId } = await auth();
    const { name } = await req.json();

    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });
    if (!name) return new NextResponse("Name is required", { status: 400 });

    const db = await getDb();
    const mongoUser = await db.collection("User").findOne({ clerkId });
    if (!mongoUser) return new NextResponse("User not found", { status: 404 });

    const now = new Date();
    const result = await db.collection("Company").insertOne({
      userId: mongoUser._id.toString(),
      name,
      followers: [],
      createdAt: now,
      updatedAt: now,
    });

    const company = await db.collection("Company").findOne({ _id: result.insertedId });
    return NextResponse.json({ ...company, id: result.insertedId.toString() });
  } catch (error) {
    console.log(`[COMPANY_POST] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
