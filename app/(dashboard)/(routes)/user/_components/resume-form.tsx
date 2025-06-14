"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Resumes, UserProfile } from "@/lib/generated/prisma";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AttachmentsUploads from "@/components/AttachmentsUpload";

interface ResumeFormProps {
  initialData: (UserProfile & {resumes: Resumes[];
}) | null;
  clerkId: string;
}

// Zod schema for form validation
const formSchema = z.object({
  resumes: z
    .object({
      url: z.string(),
      name: z.string(),
    })
    .array(),
});

const ResumeForm = ({ initialData, clerkId }: ResumeFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  // Initialize form with zod resolver and default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumes: initialData?.resumes || [],
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // PATCH to your route: /api/users/[userId]/resumes/[resumeId]
      const response = await axios.patch(
        `/api/users/${clerkId}/resumes/active`,
        values
      );
      toast.success("Resumes updated successfully!");
      toggleEditing();
      router.refresh();
      return response.data;
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  const toggleEditing = () => {
    setIsEditing((current) => !current);
  };

  return (
    <div className="mt-6 border rounded-md p-4 flex-1 w-full">
      <div className="font-medium flex items-center justify-between">
        Your Resumes
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

      {/* View mode */}
      {!isEditing && (
        <div className="space-y-5 mt-5">
          {initialData?.resumes.length ? (
            initialData.resumes.map((attachment, index) => (
              <a
                key={index}
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full h-10 px-4 py-2 rounded-md bg-muted text-sm text-foreground hover:bg-muted/80 transition border"
              >
                <div className="flex items-center gap-2 truncate">
                  📎{" "}
                  <span className="truncate">
                    {attachment.name || "Untitled File"}
                  </span>
                </div>
              </a>
            ))
          ) : (
            <div className="text-muted-foreground text-sm">
              No resumes uploaded yet.
            </div>
          )}
        </div>
      )}

      {/* Edit mode */}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center gap-2 flex-1"
          >
            <FormField
              control={form.control}
              name="resumes"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <AttachmentsUploads
                      value={field.value}
                      disabled={isSubmitting}
                      onChange={(attachments) => {
                        field.onChange(
                          attachments.map((item) => ({
                            name: item.name,
                            url: item.url,
                          }))
                        );
                      }}
                      onRemove={(itemToRemove) =>
                        field.onChange(
                          field.value?.filter(
                            (item) => item.url !== itemToRemove.url
                          )
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
                className="text-white"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ResumeForm;