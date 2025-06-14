"use client"

import Box from "@/components/box"
import { Job } from "@/lib/generated/prisma"
import { PageContent } from "../(routes)/search/_components/PageContent"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface RecommendedJobsListProps { 
  jobs : Job[]
  userId : string | null
}

const RecommendedJobsList = ({jobs, userId} : RecommendedJobsListProps) => {
  return (
    <Box className="flex-col justify-center gap-y-4 my-6 mt-18">
      <h2 className="text-2xl tracking-wider font-bold font-sans">Your Next Role Could Be Right Here</h2>
      <p className="text-muted-foreground text-sm">Find jobs that match your ambition, passion, and experience — all in one place.</p>

      <div className="mt-5">
        <PageContent jobs={jobs} userId={userId} />
      </div>

      <Link href={"/search"} className="my-8">
      <Button  className="w-44 h-14 rounded-xl border border-primary hover:bg-transparent hover:text-black hover:dark:text-white hover:shadow-md text-white  bg-primary">See all jobs</Button>
      </Link>
    </Box>
  )
}

export default RecommendedJobsList