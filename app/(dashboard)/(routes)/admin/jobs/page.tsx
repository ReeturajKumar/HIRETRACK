import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import Link from "next/link";
import { columns } from "./_components/columns";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import getDb from "@/lib/db";

import { ObjectId } from "mongodb";
import { JobsColumns } from "./_components/columns";
import { format } from "date-fns";

const JobsPageOverview = async () => {
  const { userId } = await auth();

  if (!userId) return redirect("/");

  const db = await getDb();
  const mongoUser = await db.collection("User").findOne({ clerkId: userId });
  if (!mongoUser) return redirect("/");

  const jobsDocs = await db
    .collection("Job")
    .find({ userId: mongoUser._id.toString() })
    .sort({ createdAt: -1 })
    .toArray();

  const formattedJobs: JobsColumns[] = await Promise.all(
    jobsDocs.map(async (job) => {
      const category = job.categoryId
        ? await db.collection("Category").findOne({ _id: new ObjectId(job.categoryId) })
        : null;
      const company = job.companyId
        ? await db.collection("Company").findOne({ _id: new ObjectId(job.companyId) })
        : null;
      return {
        id: job._id.toString(),
        title: job.title,
        company: company?.name ?? "",
        category: category?.name ?? "",
        isPublished: job.isPublished,
        createdAt: job.createdAt ? format(job.createdAt, "MMMM do, yyyy") : "",
      };
    })
  );

  return (
    <div className="p-6">
      <div className="flex items-end justify-end">
        <Link href={"/admin/create"}>
          <Button className="text-white">
            <Plus className="w-5 h-5" />
            New Job
          </Button>
        </Link>
      </div>

      <div className="mt-6">
        <DataTable columns={columns} data={formattedJobs} searchKey="title" />
      </div>
    </div>
  );
};

export default JobsPageOverview;
