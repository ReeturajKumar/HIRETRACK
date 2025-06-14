import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{ // <-- THIS IS THE CRUCIAL CHANGE
    companyId: string;
  }>;
}

export const PATCH = async (req: Request, { params }: Params) => {
  try {
    const { userId: clerkId } = await auth();  // Get Clerk userId (clerkId)
     const awaitedParams = await params; // ADD THIS LINE
    const { companyId } = awaitedParams; // Destructure from the awaited version

    const updatedValues = await req.json();

    if (!clerkId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!companyId) {
      return new NextResponse("ID is required", { status: 400 });
    }

    // Retrieve MongoDB userId using clerkId
    const user = await db.user.findUnique({
      where: {
        clerkId,  // Use clerkId to fetch MongoDB _id
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const company = await db.company.update({
      where: {
        id: companyId,
        userId: user.id,  // Use MongoDB _id here
      },
      data: {
        ...updatedValues,
      },
    });

    return NextResponse.json(company);
  } catch (error) {
    console.log(`[COMPANY_PATCH] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
