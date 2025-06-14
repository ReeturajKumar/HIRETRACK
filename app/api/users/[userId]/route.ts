import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request) => {


  try {
    const { userId: clerkId } = await auth();
    const values = await req.json();

    if (!clerkId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const profile = await db.userProfile.findUnique({
      where: {
        userId: clerkId,
      },
    });

    let userProfile

    if (profile) {
      userProfile = await db.userProfile.update({
        where: {
          userId: clerkId,
        },
        data: {
          ...values,
        },
      })
    } else{
      userProfile = await db.userProfile.create({
        data: {
          userId: clerkId,
          ...values,
        },
      });
    }

    return NextResponse.json(userProfile);
  } catch (error) {
    console.log(`[JOB_PATCH] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

