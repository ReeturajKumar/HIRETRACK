import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { public_id, resource_type } = await req.json();

    if (!public_id) {
      return NextResponse.json({ error: "public_id is required" }, { status: 400 });
    }

    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: resource_type || "image",
    });

    if (result.result === "ok" || result.result === "not found") {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  } catch (error) {
    console.error("[DELETE_ERROR]", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
