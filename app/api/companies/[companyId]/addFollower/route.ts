import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { ObjectId } from "mongodb";

interface Params {
  params: Promise<{ companyId: string }>;
}

export const PATCH = async (req: Request, { params }: Params) => {
  try {
    const { userId: clerkId } = await auth();
    const { companyId } = await params;

    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });
    if (!companyId) return new NextResponse("ID is required", { status: 400 });

    const db = await getDb();
    const company = await db.collection("Company").findOne({ _id: new ObjectId(companyId) });
    if (!company) return new NextResponse("Company not found", { status: 404 });

    // Add clerkId to followers if not already present
    const result = await db.collection("Company").findOneAndUpdate(
      { _id: new ObjectId(companyId) },
      { $addToSet: { followers: clerkId }, $set: { updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    return NextResponse.json({ ...result, id: result?._id.toString() });
  } catch (error) {
    console.log(`[COMPANY_ADD_FOLLOWER] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
