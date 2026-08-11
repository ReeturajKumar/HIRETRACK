import { currentUser } from "@clerk/nextjs/server";
import getDb from "./db";

export async function syncUserToDB() {
  try {
    const user = await currentUser();
    if (!user) return;

    const db = await getDb();
    const users = db.collection("User");

    const existing = await users.findOne({ clerkId: user.id });
    if (existing) return;

    const existingByEmail = await users.findOne({
      email: user.emailAddresses[0].emailAddress,
    });
    if (existingByEmail) {
      console.log("User with this email already exists.");
      return;
    }

    await users.insertOne({
      clerkId: user.id,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
      role: "user",
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("syncUserToDB skipped:", error);
  }
}
