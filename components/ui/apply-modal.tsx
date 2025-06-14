"use client";

import { Resumes, UserProfile } from "@/lib/generated/prisma";
import { useEffect, useState } from "react";
import { Modal } from "./modal";
import Box from "../box";
import Link from "next/link";
import { Button } from "./button";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  userProfile?: (UserProfile & { resumes: Resumes[] }) | null;
}

export const ApplyModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  userProfile,
}: ApplyModalProps) => {
  const [isMounted, setisMounted] = useState(false);

  useEffect(() => {
    setisMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  return (
    <Modal
      title="Apply to Job"
      description="Are you sure you want to apply to this job?"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Box>
        <div className="grid grid-cols-2 gap-2 w-full">
          <label className="p-3 border rounded-md">
            {userProfile?.fullName}
          </label>
          <label className="p-3 border rounded-md">
            {userProfile?.contact}
          </label>
          <label className="p-3 border rounded-md col-span-2">
            {userProfile?.email}
          </label>
          <label className="p-3 border rounded-md col-span-2 flex items-center gap-2 whitespace-nowrap">
            Your Active Resume :
            <span>
              {userProfile?.resumes
                .filter((resume) => resume.id !== userProfile?.activeResumeId)
                .map((resume) => (
                  <div key={resume.id}>
                    <p className="font-medium text-primary">{resume.name}</p>
                  </div>
                ))}
            </span>
          </label>

          <div className="col-span-2 flex items-center justify-end text-sm text-muted-foreground">
            Change Your Details : <Link href="/user" className="text-primary ml-2">Go To Profile</Link>
          </div>
        </div>
      </Box>


      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} variant={"outline"} onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} onClick={onConfirm} className="bg-primary hover:bg-primary-900 text-white">
          Continue
        </Button>
      </div>
    </Modal>
  );
};
