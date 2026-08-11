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
    const updatedValues = await req.json();

    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });
    if (!companyId) return new NextResponse("ID is required", { status: 400 });

    const db = await getDb();
    const mongoUser = await db.collection("User").findOne({ clerkId });
    if (!mongoUser) return new NextResponse("User not found", { status: 404 });

    const result = await db.collection("Company").findOneAndUpdate(
      { _id: new ObjectId(companyId), userId: mongoUser._id.toString() },
      { $set: { ...updatedValues, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    if (!result) return new NextResponse("Company not found", { status: 404 });
    return NextResponse.json({ ...result, id: result._id.toString() });
  } catch (error) {
    console.log(`[COMPANY_PATCH] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
