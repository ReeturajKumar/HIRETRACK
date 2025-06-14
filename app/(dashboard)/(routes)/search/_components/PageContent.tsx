"use client"

import { Job } from "@/lib/generated/prisma"
import Image from "next/image"
import img1 from "@/public/not-found.png"
import { AnimatePresence, motion } from "framer-motion"
import JobCard from "./JobCard"
import { fadeInOut } from "@/animations"

interface PageContentProps {
  jobs: Job[]
  userId: string | null
}

export const PageContent = ({ jobs, userId }: PageContentProps) => {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="w-full h-[60vh] relative flex items-center justify-center">
          <Image
            src={img1}
            alt="Empty"
            fill
            className="object-contain"
          />
        </div>
        <h2 className="text-4xl font-bold text-muted-foreground mt-4">
          No Jobs Found
        </h2>
      </div>
    )
  }

  return (
    <div className="pt-4">
      <AnimatePresence>
        <motion.div
          {...fadeInOut}
          layout
          className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-6"
        >
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} userId={userId} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
