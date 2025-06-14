"use client";
import { FilePlus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { storage } from "@/config/firebase.config";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import toast from "react-hot-toast";
import { Button } from "./ui/button";

// Define a type for the attachment item for clarity and consistency
type AttachmentItem = { url: string; name: string };

interface AttachmentsUploadsProps {
  disabled?: boolean;
  onChange: (value: AttachmentItem[]) => void;
  // Crucially, onRemove now expects the full item object to be removed
  onRemove: (itemToRemove: AttachmentItem) => void;
  value: AttachmentItem[];
}

export default function AttachmentsUploads({
  disabled,
  onChange,
  onRemove, // Destructure onRemove from props
  value,
}: AttachmentsUploadsProps) {
  const [isMounted, setisMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    setisMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setLoading(true);
    setProgress(0);

    const newUrls: AttachmentItem[] = []; // Use AttachmentItem type
    let completedFiles = 0;
    const individualProgress = new Array(files.length).fill(0);

    files.forEach((file, index) => {
      const storageRef = ref(storage, `Attachments/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          individualProgress[index] = snapshot.bytesTransferred / snapshot.totalBytes;
          const totalProgress = (individualProgress.reduce((a, b) => a + b, 0) / files.length) * 100;
          setProgress(totalProgress);
        },
        (error) => {
          toast.error(error.message);
          setLoading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          newUrls.push({ url: downloadURL, name: file.name });
          completedFiles++;

          if (completedFiles === files.length) {
            onChange([...value, ...newUrls]);
            setLoading(false);
          }
        }
      );
    });
  };

  // This handler now calls the 'onRemove' prop passed from the parent component
  const onDeleteHandler = (itemToRemove: AttachmentItem) => {
    // Call the parent's onRemove prop directly, passing the full item object
    onRemove(itemToRemove);

    // Also handle the Firebase storage deletion
    const storageRef = ref(storage, itemToRemove.url);
    deleteObject(storageRef)
      .then(() => {
        toast.success("Attachment removed successfully");
      })
      .catch((error) => {
        console.log("Error deleting file from Firebase:", error);
        toast.error("Failed to delete file from storage.");
      });
  };

  return (
    <div className="">
      <div className="w-full p-2 flex items-center justify-end">
        {loading ? (
          <p className="text-sm text-muted-foreground">
            Uploading... {progress.toFixed(0)}%
          </p>
        ) : (
          <label>
            <div className="flex gap-2 items-center justify-center cursor-pointer">
              <FilePlus className="text-muted-foreground w-3 h-3 mr-2" />
              <p className="text-sm text-muted-foreground">
                Upload Attachments
              </p>
            </div>
            <Input
              type="file"
              accept=".pdf,.doc,.docx,.txt,.rtf,.odt,.xls,.xlsx,.ppt,.pptx"
              multiple
              className="sr-only w-0 h-0 overflow-hidden absolute"
              disabled={disabled || loading}
              onChange={onUpload}
            />
          </label>
        )}
      </div>

      <div className="flex-col">
        {value && value.length > 0 ? (
          <>
            <div className="space-y-2">
              {value.map((item) => (
                <div key={item.url} className="flex items-center p-3 w-full bg-purple-100 border-purple-700 text-purple-700 rounded-md gap-x-2 dark:bg-[#141416] dark:text-white">
                  <FilePlus className="text-muted-foreground w-3 h-3 mr-2" />
                  <p className="text-sm text-muted-foreground w-full truncate">
                    {item.name}
                  </p>
                  <Button
                    variant="ghost" size={"icon"}
                    type="button"
                    onClick={() => onDeleteHandler(item)} // Pass the full item object to the handler
                    className="ml-2 text-sm text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>No Attachments</p>
        )}
      </div>
    </div>
  );
}