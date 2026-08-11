"use client";
import { FilePlus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import toast from "react-hot-toast";
import { Button } from "./ui/button";

// Each attachment now stores the Cloudinary public_id alongside url and name
// so we can delete from Cloudinary server-side.
type AttachmentItem = { url: string; name: string; public_id?: string };

interface AttachmentsUploadsProps {
  disabled?: boolean;
  onChange: (value: AttachmentItem[]) => void;
  onRemove: (itemToRemove: AttachmentItem) => void;
  value: AttachmentItem[];
}

export default function AttachmentsUploads({
  disabled,
  onChange,
  onRemove,
  value,
}: AttachmentsUploadsProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setLoading(true);
    setProgress(0);

    const newItems: AttachmentItem[] = [];
    let completed = 0;

    const uploadFile = async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "hiretrack/attachments");

      // Fake per-file progress: mark each file as ~50% while uploading
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `Failed to upload ${file.name}`);
      }

      const data: { url: string; public_id: string; name: string } = await res.json();

      newItems.push({
        url: data.url,
        public_id: data.public_id,
        name: file.name,
      });

      completed++;
      setProgress(Math.round((completed / files.length) * 100));
    };

    try {
      // Upload all files in parallel
      await Promise.all(files.map((file) => uploadFile(file)));
      onChange([...value, ...newItems]);
      toast.success(`${files.length} file${files.length > 1 ? "s" : ""} uploaded`);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setLoading(false);
      setProgress(0);
      e.target.value = "";
    }
  };

  const onDeleteHandler = async (itemToRemove: AttachmentItem) => {
    // Optimistically update the parent UI immediately
    onRemove(itemToRemove);

    if (!itemToRemove.public_id) return;

    try {
      const res = await fetch("/api/upload/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          public_id: itemToRemove.public_id,
          resource_type: "raw",
        }),
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Attachment removed successfully");
    } catch {
      toast.error("Failed to delete attachment from storage.");
    }
  };

  return (
    <div className="">
      <div className="w-full p-2 flex items-center justify-end">
        {loading ? (
          <div className="flex flex-col items-center gap-1 w-full">
            <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-200 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Uploading… {progress}%
            </p>
          </div>
        ) : (
          <label>
            <div className="flex gap-2 items-center justify-center cursor-pointer">
              <FilePlus className="text-muted-foreground w-3 h-3 mr-2" />
              <p className="text-sm text-muted-foreground">Upload Attachments</p>
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
          <div className="space-y-2">
            {value.map((item) => (
              <div
                key={item.url}
                className="flex items-center p-3 w-full bg-purple-100 border-purple-700 text-purple-700 rounded-md gap-x-2 dark:bg-[#141416] dark:text-white"
              >
                <FilePlus className="text-muted-foreground w-3 h-3 mr-2 shrink-0" />
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground w-full truncate hover:underline"
                >
                  {item.name}
                </a>
                <Button
                  variant="ghost"
                  size={"icon"}
                  type="button"
                  onClick={() => onDeleteHandler(item)}
                  className="ml-2 text-sm text-white shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No Attachments</p>
        )}
      </div>
    </div>
  );
}