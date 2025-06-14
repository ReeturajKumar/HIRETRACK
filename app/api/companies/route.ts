import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { userId: clerkId } = await auth();
    const { name } = await req.json();

    if (!clerkId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const mongoUser = await db.user.findUnique({
      where: { clerkId },
    });

    if (!mongoUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const company = await db.company.create({
      data: {
        name,
        userId: mongoUser.id, // ✅ Use MongoDB ObjectId here
      },
    });

    return NextResponse.json(company);
  } catch (error) {
  console.log(`[COMPANY_POST] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
