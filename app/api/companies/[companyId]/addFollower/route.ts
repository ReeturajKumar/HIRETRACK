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
    const { userId: clerkId } = await auth();
    const awaitedParams = await params;
    const { companyId } = awaitedParams;
    if (!clerkId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!companyId) {
      return new NextResponse("ID is required", { status: 400 });
    }

    const company = await db.company.findUnique({
      where: {
        id: companyId,
      },
    })

    if (!company) {
      return new NextResponse("Company not found", { status: 404 });
    }

    const updateData = {
      followers: company?.followers ? {push: clerkId} : [clerkId]
    };

    const updatedCompany = await db.company.update({
      where: {
        id: companyId,
      },
      data: updateData,
    });

    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.log(`[COMPANY_PATCH] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
