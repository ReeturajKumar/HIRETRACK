"use client"

import { Job } from "@/lib/types/models";
import { PageContent } from "../../../search/_components/PageContent";

interface JobsTabsContentProps {
  userId: string | null;
  jobs: Job[];
}

const JobsTabsContent = ({ userId, jobs }: JobsTabsContentProps) => {
  return (
   <PageContent jobs={jobs} userId={userId} />
  )
}

export default JobsTabsContent