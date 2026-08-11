// ✅ Correct export for App Router API route
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import getDb from "@/lib/db";

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const dbUser = await db.collection("User").findOne({ clerkId: user.id });

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ role: dbUser.role });
}
