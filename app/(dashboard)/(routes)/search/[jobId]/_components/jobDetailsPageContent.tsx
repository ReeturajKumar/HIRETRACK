/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Banner } from "@/components/banner";
import Box from "@/components/box";
import { CustomeBreadCrummb } from "@/components/CustomeBreadCrummb";
import JobDescriptionPreview from "@/components/preview";
import { ApplyModal } from "@/components/ui/apply-modal";
import { Button } from "@/components/ui/button";
// Assuming Prisma models are correctly imported:
import { Company, Job, Resumes, UserProfile, Prisma } from "@/lib/generated/prisma"; // Added Prisma import for JsonValue

import axios from "axios";
import { FileIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

// Define the expected structure for an attachment item
type JobAttachment = {
  id: string; // Assuming 'id' is present and used for keys
  url: string;
  name: string;
};

interface JobDetailsPageContentProps {
  // --- IMPORTANT CHANGE HERE ---
  // Correctly define 'attachments' as an array of 'JobAttachment' objects.
  // We also include Prisma.JsonValue | null because Prisma often types JSON fields broadly.
  job: Job & { company: Company | null; attachments: JobAttachment[] | Prisma.JsonValue | null };
  jobId: string;
  userProfile: (UserProfile & {resumes: Resumes[];
  }) | null;
}

export const JobDetailsPageContent = ({
  job,
  jobId,
  userProfile,
}: JobDetailsPageContentProps) => {
  const [isLoading, setisLoading] = useState(false);
  const [open, setopen] = useState(false);
  const router = useRouter();


  const onApplied = async () => {
    setisLoading(true);
    try {
      const responce = await axios.patch(`/api/users/${userProfile?.userId}/appliedJobs`,jobId);

      // sending email
      await axios.post(`/api/thankyou`,{
        fullName:userProfile?.fullName,
        email:userProfile?.email,
      });
      toast.success("Job has been applied successfully");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }finally{
      setopen(false);
      setisLoading(false);
      router.refresh();
    }
  };

  return (
    <>
      <ApplyModal
        isOpen={open}
        onClose={() => setopen(false)}
        onConfirm={onApplied}
        loading={isLoading}
        userProfile={userProfile}
      />


      {userProfile && userProfile?.appliedJobs?.some(appliedJob => appliedJob.jobId === jobId) && (
        <Banner
          label="Thank you for applying! Your application has been received, and we're reviewing it carefully. We'll get back to you soon."
          variant="success"
        />
      )}
      <Box className="mt-4">
        <CustomeBreadCrummb
          createCrumbItem={[{ label: "Search", link: "/search" }]}
          breadCrumbPage={job.title !== undefined ? job.title : ""}
        />
      </Box>

      {/* job cover image */}
      <Box className="mt-4">
        <div className="w-full flex items-center h-72 relative rounded-md overflow-hidden">
          {job?.imageUrl ? (
            <Image
              src={job.imageUrl}
              alt={job.title}
              fill
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-muted-foreground flex items-center justify-center">
              <h2 className="text-3xl font-semibold tracking-wider">
                {job?.title}
              </h2>
            </div>
          )}
        </div>
      </Box>

      {/* title and actions btn */}
      <Box className="mt-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-wider">
            {job?.title}
          </h2>
          <Link href={`/companies/${job?.companyId}`} className="py-2">
            <div className="flex items-center gap-2 mt-1">
              {job.company?.logo && (
                <Image
                  src={job?.company?.logo}
                  alt={job?.company?.name}
                  width={30}
                  height={30}
                />
              )}

              <p className="text-muted-foregroundtext-sm font-semibold">
                {job?.company?.name}
              </p>
            </div>
          </Link>
        </div>

        <div>
          {userProfile ? (
            <>
              {!userProfile.appliedJobs.some(
                (appliedJob) => appliedJob.jobId === jobId
              ) ? (
                <Button className="text-sm px-8 py-5 bg-primary hover:bg-blue-900 hover:shadow-sm text-white" onClick={() => setopen(true)}>
                  Apply Now
                </Button>
              ) : (
                <Button
                  className="text-sm px-8 py-5 bg-primary hover:bg-blue-900 hover:shadow-sm text-white hover:text-white"
                  variant={"outline"}
                >
                  Already Applied
                </Button>
              )}
            </>
          ) : (
            <Link href={"/user"}>
              <Button className="text-sm px-8 py-5 bg-primary hover:bg-blue-900 hover:shadow-sm text-white">
                Update Profile
              </Button>
            </Link>
          )}
        </div>
      </Box>

      {/* description */}
      <Box className="flex-col my-4 items-start justify-start px-4 gap-2">
        <h2 className="text-lg font-semibold">Description</h2>
        <p className="text-muted-foreground font-sans">
          {job?.short_description}
        </p>
      </Box>

      {job?.description && (
        <Box className="flex-col my-4 items-start justify-start px-4 gap-2">
          <JobDescriptionPreview description={job?.description} />
        </Box>
      )}

      {/* Attachments Section */}
      {/* --- IMPORTANT CHANGE HERE --- */}
      {/* Add Array.isArray check and type assertion for robust mapping */}
      {job?.attachments && Array.isArray(job.attachments) && (job.attachments as JobAttachment[]).length > 0 && (
        <Box className="flex-col my-4 items-start justify-start gap-2 px-4">
          <h2 className="text-lg font-semibold">Attachments</h2>
          {(job.attachments as JobAttachment[]).map((item) => ( // Assert type here for the map function
            <div key={item.id} className="space-y-3">
              <p>Download the attachments to know more about the job</p>
              <Link
                href={item.url}
                target="_blank"
                className="text-blue-500 hover:underline flex items-center gap-2"
              >
                <FileIcon className="size-4" /> {item.name}
              </Link>
            </div>
          ))}
        </Box>
      )}
    </>
  );
};