"use client";

import { Company, Job } from "@/lib/generated/prisma";
import { Card, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import Box from "@/components/box";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  BookmarkCheck,
  BriefcaseBusiness,
  Currency,
  Layers,
  Loader2,
  Network,
} from "lucide-react";
import { cn, formattedString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { truncate } from "lodash";
import toast from "react-hot-toast";
import axios from "axios";
// import { useRouter } from "next/navigation";

interface JobCardProps {
  job: Job;
  userId: string | null;
}

export default function JobCard({ job, userId }: JobCardProps) {
  const typeJob = job as Job & {
    company: Company | null;
  };
  const company = typeJob.company;

  // const router = useRouter();

  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(
    userId ? job.savedUsers?.includes(userId) : false
  );

  const SavedUsersIcon = isSaved ? BookmarkCheck : Bookmark;

  const onClickSavedJob = async () => {
    try {
      setBookmarkLoading(true);

      if (isSaved) {
        await axios.patch(`/api/jobs/${job.id}/unsaveJob`);
        toast.success("Job Removed Successfully");
        setIsSaved(false);
      } else {
        await axios.patch(`/api/jobs/${job.id}/savedJob`);
        toast.success("Job Added Successfully");
        setIsSaved(true);
      }

      // Optional: Refresh if needed elsewhere
      // router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.log(`Error: ${(error as Error)?.message}`);
    } finally {
      setBookmarkLoading(false);
    }
  };

  return (
    <motion.div layout>
      <Card>
        <div className="w-full h-full pl-4 pr-4 flex flex-col items-start justify-start gap-y-4">
          <Box className="items-center justify-start gap-x-4">
            <div className="w-12 h-12 min-w-12 min-h-12 border p-2 rounded-md relative flex items-center justify-center overflow-hidden">
              {company?.logo && (
                <Image
                  src={company.logo}
                  alt="company logo"
                  className="w-full h-full object-contain"
                  width={40}
                  height={40}
                />
              )}
            </div>
            <div className="w-full">
              <p className="text-muted-foreground font-medium text-base w-full truncate">
                {job.title}
              </p>

              <Link
                href={`/companies/${company?.id}`}
                className="font-semibold text-sm w-full truncate text-primary"
              >
                {company?.name}
              </Link>
            </div>
          </Box>

          <Box className="w-full overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-x-4 whitespace-nowrap">
              {job.employmentType && (
                <div className="text-xs text-muted-foreground flex items-center gap-x-1">
                  <BriefcaseBusiness className="w-4 h-4" />
                  {formattedString(job.employmentType)}
                </div>
              )}

              {job.workMode && (
                <div className="text-xs text-muted-foreground flex items-center gap-x-1">
                  <Layers className="w-4 h-4" />
                  {formattedString(job.workMode)}
                </div>
              )}

              {job.salaryRange && (
                <div className="text-xs text-muted-foreground flex items-center gap-x-1">
                  <Currency className="w-4 h-4" />
                  {`$${formattedString(job.salaryRange)} /year`}
                </div>
              )}

              {job.yearsOfExperience && (
                <div className="text-xs text-muted-foreground flex items-center gap-x-1">
                  <Network className="w-4 h-4" />
                  {formattedString(job.yearsOfExperience)}
                </div>
              )}
            </div>
          </Box>

          {job.short_description && (
            <CardDescription className="text-muted-foreground">
              {truncate(job.short_description, {
                length: 180,
                omission: "...",
              })}
            </CardDescription>
          )}

          {job.tags.length > 0 && (
            <Box className="flex-wrap justify-start gap-x-2 gap-y-2">
              {job.tags.slice(0, 6).map((tag, i) => (
                <p
                  key={i}
                  className="bg-primary text-white text-xs rounded-md px-2 py-[5px] font-semibold"
                >
                  {tag}
                </p>
              ))}
            </Box>
          )}

          <Box className="flex flex-wrap gap-2 mt-auto">
            <Link href={`/search/${job.id}`} className="flex-1">
              <Button
                className="w-full border border-primary text-black hover:bg-transparent hover:text-primary dark:bg-transparent dark:text-primary"
                variant="outline"
              >
                View Details
              </Button>
            </Link>

            <Button
              className="flex-1 text-white hover:bg-primary bg-primary/90 hover:text-white dark:bg-primary dark:text-white"
              variant="outline"
              onClick={onClickSavedJob}
              disabled={bookmarkLoading}
            >
              {isSaved ? "Saved" : "Save For Later"}
            </Button>
          </Box>

          <Box>
            <p className="text-muted-foreground text-sm">
              {formatDistanceToNow(new Date(job.createdAt), {
                addSuffix: true,
              })}
            </p>

            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={onClickSavedJob}
              disabled={bookmarkLoading}
            >
              {bookmarkLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <SavedUsersIcon
                  className={cn(
                    "w-5 h-5",
                    isSaved ? "text-primary" : "text-muted-foreground"
                  )}
                />
              )}
            </Button>
          </Box>
        </div>
      </Card>
    </motion.div>
  );
}
