/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/(routes)/admin/jobs/[jobId]/_components/AttachmentsForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Job } from "@/lib/generated/prisma"; // Assuming Job is correctly imported
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import AttachmentsUploads from "@/components/AttachmentsUpload";

interface AttachmentsFormProps {
  initialData: Job; // 'attachments' property comes from this Job type
  jobId: string;
}

// Define a type for your attachment object for clarity and reuse
type AttachmentItem = { url: string; name: string };

const formSchema = z.object({
  attachments: z.array(z.object({ url: z.string(), name: z.string() })),
});

const AttachmentsForm = ({ initialData, jobId }: AttachmentsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  // Assert initialData.attachments as a JSON array (or null/undefined)
  // And then map it, ensuring null/undefined map to empty array
  const initialAttachments = Array.isArray(initialData.attachments)
    ? (initialData.attachments as AttachmentItem[]) // Assert it as an array of your expected type
        .map((attachment: any) => { // Keep 'any' here for robustness against unexpected data shapes from DB
          if (
            typeof attachment === 'object' &&
            attachment !== null &&
            'url' in attachment &&
            'name' in attachment &&
            typeof attachment.url === 'string' && // Add type check for url
            typeof attachment.name === 'string'    // Add type check for name
          ) {
            return {
              url: attachment.url,
              name: attachment.name,
            };
          }
          return undefined; // Return undefined for invalid items
        })
        .filter(Boolean) as AttachmentItem[] // Filter out undefined and assert final type
    : [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      attachments: initialAttachments,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Job Updated Successfully!");
      toggleEditing();
      router.refresh();
      return response.data;
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  const toggleEditing = () => {
    setIsEditing((current) => !current);
  };

  return (
    <div className="mt-6 border rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Attachments
        <Button onClick={toggleEditing} className="text-sm" variant={"ghost"}>
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div className="space-y-5 mt-5">
          {/* Add a more robust check here as well */}
          {initialData.attachments && Array.isArray(initialData.attachments) && (initialData.attachments as AttachmentItem[]).length > 0 ? (
            // Assert type during map as well if you want stricter checking
            (initialData.attachments as AttachmentItem[]).map((attachment: AttachmentItem, index: number) => (
              <a
                key={index}
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full h-10 px-4 py-2 rounded-md bg-muted text-sm text-foreground hover:bg-muted/80 transition border"
              >
                <div className="flex items-center gap-2 truncate">
                  📎 <span className="truncate">{attachment.name || "Untitled File"}</span>
                </div>
              </a>
            ))
          ) : (
            <div className="text-muted-foreground text-sm">This job has no attachments</div>
          )}
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="attachments"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AttachmentsUploads
                      value={field.value}
                      disabled={isSubmitting}
                      onChange={(attachments) => {
                        field.onChange(attachments.map(item => item));
                      }}
                      onRemove={() => field.onChange([])} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit" className="text-white">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default AttachmentsForm;