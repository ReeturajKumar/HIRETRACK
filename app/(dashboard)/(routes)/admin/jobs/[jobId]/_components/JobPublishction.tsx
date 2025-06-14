/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface JobPublishActionProps{
  disabled : boolean;
  JobId: string;
  isPublished: boolean;
}

export const JobPublishAction = ({disabled,JobId , isPublished} : JobPublishActionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onClick = async () => {
    try {
      setIsLoading(true);
      if (isPublished) {
        await axios.patch(`/api/jobs/${JobId}/unpublish`);
        toast.success("Job Unpublished Successfully!");
        router.push("/admin/jobs");
      } else {
        await axios.patch(`/api/jobs/${JobId}/publish`);
        toast.success("Job Published Successfully!");
        router.push("/admin/jobs");
      }

      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }finally{
      setIsLoading(false);
    }
  }
  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/jobs/${JobId}`);
      toast.success("Job Deleted Successfully!");
      router.refresh();
      router.push("/admin/jobs");
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }finally{
      setIsLoading(false);
    }
  }
  return (
    <div className="flex items-center gap-x-3">
      <Button variant={"outline"} disabled={disabled || isLoading} size={"sm"} onClick={onClick}>
        {isPublished ? "Unpublish" : "Publish"}
      </Button>

      <Button variant={"destructive"} disabled={isLoading} size={"sm"} onClick={onDelete}>
        <Trash className="w-4 h-4" />
      </Button>
    </div>
  )
}
