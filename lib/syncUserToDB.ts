import { currentUser } from "@clerk/nextjs/server";
import db from "./db";

export async function syncUserToDB() {
  const user = await currentUser();
  if (!user) return;

  const existingUserByClerkId = await db.user.findUnique({
    where: {
      clerkId: user.id,
    },
  });

  if (!existingUserByClerkId) {
    const existingUserByEmail = await db.user.findUnique({
      where: {
        email: user.emailAddresses[0].emailAddress,
      },
    });

    if (existingUserByEmail) {
      console.log("User with this email already exists.");
      return;
    }
    await db.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
        role: "user", // Default role is 'user'
      },
    });
  }
}
