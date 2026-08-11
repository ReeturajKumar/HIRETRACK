import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.DATABASE_URL!);

async function cleanup() {
  try {
    await client.connect();
    const db = client.db();
    console.log("Connected to MongoDB. Starting cleanup...");

    const firebasePattern = /firebasestorage\.googleapis\.com/;

    // 1. Cleanup Jobs
    const jobsResult = await db.collection("Job").updateMany(
      { imageUrl: { $regex: firebasePattern } },
      { $set: { imageUrl: null } }
    );
    console.log(`Cleaned ${jobsResult.modifiedCount} Job images.`);

    // 2. Cleanup Company Logos
    const companyLogoResult = await db.collection("Company").updateMany(
      { logo: { $regex: firebasePattern } },
      { $set: { logo: null } }
    );
    console.log(`Cleaned ${companyLogoResult.modifiedCount} Company logos.`);

    // 3. Cleanup Company Covers
    const companyCoverResult = await db.collection("Company").updateMany(
      { coverImage: { $regex: firebasePattern } },
      { $set: { coverImage: null } }
    );
    console.log(`Cleaned ${companyCoverResult.modifiedCount} Company covers.`);

    // 4. Cleanup Resumes (if any)
    const resumeResult = await db.collection("Resumes").updateMany(
        { url: { $regex: firebasePattern } },
        { $set: { url: "REMOVED_BROKEN_LINK" } } // Better to mark resumes as removed than nulling out required field
      );
      console.log(`Cleaned ${resumeResult.modifiedCount} Resumes.`);

    console.log("Cleanup complete!");
  } catch (error) {
    console.error("Cleanup failed:", error);
  } finally {
    await client.close();
  }
}

cleanup();
