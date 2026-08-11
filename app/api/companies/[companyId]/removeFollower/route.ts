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

    const isFollower = (company.followers as string[])?.includes(clerkId);
    if (!isFollower) return new NextResponse("User not found in followers", { status: 404 });

    const result = await db.collection("Company").findOneAndUpdate(
      { _id: new ObjectId(companyId) },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { $pull: { followers: clerkId } as any, $set: { updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    return NextResponse.json({ ...result, id: result?._id.toString() });
  } catch (error) {
    console.log(`[COMPANY_REMOVE_FOLLOWER] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
