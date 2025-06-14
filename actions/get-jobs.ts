/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Job } from '@/lib/generated/prisma';

type GetJobs = {
     title?: string;
  categoryId?: string;
  createdAtFilter?: string;
  yearsOfExperience?: string | string[]; // <--- UPDATED THIS LINE
  workMode?: string;
  employmentType?: string;
  savedUsers?: boolean;
};

export const getJobs = async ({title, categoryId, createdAtFilter, yearsOfExperience, workMode, employmentType, savedUsers} : GetJobs) : Promise<Job[]> => {
 const { userId: clerkId } = await auth();
 if (!clerkId) {
  return [];
 }

  try {
    const query : any = {
      where : {
        isPublished: true,
      },
      include : {
        company : true,
        category : true,
      },
      orderBy : {
        createdAt: "desc",
      },
    }

    if(typeof title !== "undefined" || typeof categoryId !== "undefined") {
      query.where = {
       AND : [
        typeof title !== "undefined"  && {
          title : {
            contains : title,
            mode : "insensitive"
          }
        },
        typeof categoryId !== "undefined" && {
          categoryId : {
            equals : categoryId
          }
        }
       ].filter(Boolean)
      }
    }

    // createdAt filter
    if(createdAtFilter) {
      const currentDate = new Date();
      let startDate : Date;

      switch (createdAtFilter) {
        case "today":
        startDate = new Date(currentDate);
        break;

        case "yesterday":
        startDate = new Date(currentDate);
        startDate.setDate(startDate.getDate() - 1);
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

      query.where.createdAt = {
        gte : startDate
      }
    }


    // filter data onbased of shift 
    const formattedShiftTiming = employmentType?.split(",")
if (formattedShiftTiming && formattedShiftTiming.length > 0) {
  query.where.employmentType = {
    in: formattedShiftTiming
  };
}



// filter data onbased of work mode 
const formattedWorkMode = workMode?.split(",")
if (formattedWorkMode && formattedWorkMode.length > 0) {
  query.where.workMode = {
    in: formattedWorkMode
  };
}


// filter data onbased of years of experience 
let formattedYearsOfExperience: string[] | undefined;

if (typeof yearsOfExperience === 'string') {
  formattedYearsOfExperience = yearsOfExperience.split(',');
} else if (Array.isArray(yearsOfExperience)) {
  formattedYearsOfExperience = yearsOfExperience; // It's already an array of strings
}
// console.log("Filtering yearsOfExperience for:", formattedYearsOfExperience);

if (formattedYearsOfExperience && formattedYearsOfExperience.length > 0) {
  query.where.yearsOfExperience = {
    in: formattedYearsOfExperience
    
  };
}


if(savedUsers){
  query.where.savedUsers = {
    has : clerkId
  }
}




    const jobs = await db.job.findMany(query)

    return jobs

    
  } catch (error) {
    console.log("[GET_JOBS]", error);
    return [];
  }
}