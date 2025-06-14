"use client";

import { Button } from "@/components/ui/button";
import { Company, Job } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Loader2, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import TabContentSection from "./TabContentSection";

interface CompnayDetailsPageContentProps {
  userId: string | null;
  company: Company;
  jobs: Job[];
}
const CompnayDetailsPageContent = ({
  userId,
  company,
  jobs,
}: CompnayDetailsPageContentProps) => {
  const isFollower = userId && company?.followers?.includes(userId);
  const [isLoading, setisLoading] = useState(false);
  const router = useRouter();

  const onClickAddRemoveFolower = async () => {
    try {
      setisLoading(true);
      if (isFollower) {
        await axios.patch(`/api/companies/${company?.id}/removeFollower`);
        toast.success("Unfollowed Successfully!");
      } else {
        await axios.patch(`/api/companies/${company?.id}/addFollower`);
        toast.success("Followed Successfully!");
      }
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error((error as Error)?.message);
    } finally {
      setisLoading(false);
    }
  };
  return (
    <div className="w-full rounded-4xl bg-white dark:bg-black p-4 z-50 -mt-8">
      <div className="flex-col w-full px-4">
        <div className="w-full flex items-center justify-between -mt-12">
          <div className="flex items-end justify-end space-x-4">
            {company?.logo && (
              <div className="aspect-square w-auto bg-white dark:bg-[#141416] h-32 rounded-4xl border flex items-center justify-center relative overflow-hidden p-3">
                <Image
                  src={company?.logo}
                  alt="Company Logo"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
            )}

            <div className="flex-col space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-sans font-bold text-muted-foreground capitalize">
                  {company?.name}
                </h2>
                <p>{`(${company?.followers?.length}) Followers`}</p>
              </div>

              <p className="text-muted-foreground">
                Leveraging Technology to Accelerate Growth
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-muted-foreground border px-2 py-1 text-sm whitespace-nowrap rounded-lg">
                  Managment Consulting
                </p>
                <p className="text-muted-foreground border px-2 py-1 text-sm whitespace-nowrap rounded-lg">
                  IT Services & Consulting
                </p>
                <p className="text-muted-foreground border px-2 py-1 text-sm whitespace-nowrap rounded-lg">
                  Software Development
                </p>
                <p className="text-muted-foreground border px-2 py-1 text-sm whitespace-nowrap rounded-lg">
                  Corporate
                </p>
              </div>
            </div>
          </div>

          <Button
            className={cn(
              "w-24 rounded-full hover-shadow-md flex items-center justify-center border border-primary text-black dark:text-white",
              !isFollower && "bg-primary hover:bg-blue-800 text-white"
            )}
            onClick={onClickAddRemoveFolower}
            variant={isFollower ? "outline" : "default"}
          >
            {isLoading ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <React.Fragment>
                {isFollower ? (
                  "Unfollow"
                ) : (
                  <React.Fragment>
                    <Plus className="size-4" /> Follow
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </Button>
        </div>


        <TabContentSection userId={userId} company={company} jobs={jobs} />
      </div>
    </div>
  );
};

export default CompnayDetailsPageContent;
