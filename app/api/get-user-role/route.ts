// ✅ Correct export for App Router API route
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import db from "@/lib/db";

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await db.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ role: dbUser.role });
}
