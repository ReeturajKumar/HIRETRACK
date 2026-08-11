/* eslint-disable @typescript-eslint/no-explicit-any */
import getDb from "@/lib/db";
import { ObjectId } from "mongodb";
import { auth } from "@clerk/nextjs/server";
import { Job } from "@/lib/types/models";
import { serializeArray } from "@/lib/serialize";

type GetJobs = {
  title?: string;
  categoryId?: string;
  createdAtFilter?: string;
  yearsOfExperience?: string | string[];
  workMode?: string;
  employmentType?: string;
  savedUsers?: boolean;
};

function toJob(doc: any): Job {
  return {
    ...doc,
    id: doc._id.toString(),
    attachments: doc.attachments ?? null,
  };
}

export const getJobs = async ({
  title,
  categoryId,
  createdAtFilter,
  yearsOfExperience,
  workMode,
  employmentType,
  savedUsers,
}: GetJobs): Promise<(Job & { company?: any; category?: any })[]> => {
  const { userId: clerkId } = await auth();
  if (!clerkId) return [];

  try {
    const db = await getDb();

    const filter: any = { isPublished: true };

    if (title) filter.title = { $regex: title, $options: "i" };
    if (categoryId) filter.categoryId = categoryId;

    // createdAt filter
    if (createdAtFilter) {
      const currentDate = new Date();
      let startDate: Date;
      switch (createdAtFilter) {
        case "today":
          startDate = new Date(currentDate.setHours(0, 0, 0, 0));
          break;
        case "yesterday":
          startDate = new Date(currentDate);
          startDate.setDate(startDate.getDate() - 1);
          startDate.setHours(0, 0, 0, 0);
          break;
        case "thisWeek":
          startDate = new Date(currentDate);
          startDate.setDate(startDate.getDate() - currentDate.getDay());
          break;
        case "lastWeek":
          startDate = new Date(currentDate);
          startDate.setDate(startDate.getDate() - currentDate.getDay() - 7);
          break;
        case "thisMonth":
          startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          break;
        default:
          startDate = new Date(0);
      }
      filter.createdAt = { $gte: startDate };
    }

    // employmentType filter
    const formattedShiftTiming = employmentType?.split(",");
    if (formattedShiftTiming && formattedShiftTiming.length > 0) {
      filter.employmentType = { $in: formattedShiftTiming };
    }

    // workMode filter
    const formattedWorkMode = workMode?.split(",");
    if (formattedWorkMode && formattedWorkMode.length > 0) {
      filter.workMode = { $in: formattedWorkMode };
    }

    // yearsOfExperience filter
    let formattedYearsOfExperience: string[] | undefined;
    if (typeof yearsOfExperience === "string") {
      formattedYearsOfExperience = yearsOfExperience.split(",");
    } else if (Array.isArray(yearsOfExperience)) {
      formattedYearsOfExperience = yearsOfExperience;
    }
    if (formattedYearsOfExperience && formattedYearsOfExperience.length > 0) {
      filter.yearsOfExperience = { $in: formattedYearsOfExperience };
    }

    // savedUsers filter
    if (savedUsers) {
      filter.savedUsers = clerkId;
    }

    const jobs = await db
      .collection("Job")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    // Enrich with company and category
    const enriched = await Promise.all(
      jobs.map(async (job) => {
        const company = job.companyId
          ? await db.collection("Company").findOne({ _id: new ObjectId(job.companyId) })
          : null;
        const category = job.categoryId
          ? await db.collection("Category").findOne({ _id: new ObjectId(job.categoryId) })
          : null;
        return {
          ...toJob(job),
          company: company ? { ...company, id: company._id.toString() } : null,
          category: category ? { ...category, id: category._id.toString() } : null,
        };
      })
    );

    return serializeArray(enriched) as (Job & { company?: any; category?: any })[];
  } catch (error) {
    console.log("[GET_JOBS]", error);
    return [];
  }
};