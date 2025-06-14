"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import getGenerativeAIResponse from "@/scripts/aistudio";
import { Job } from "@/lib/generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Lightbulb, Loader2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
interface ShortDescriptionProps {
  initialData: Job;
  jobId: string;
}

const formSchema = z.object({
  short_description: z.string().min(1),
});
const ShortDescriptionForm = ({
  initialData,
  jobId,
}: ShortDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isPrompting, setisPrompting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      short_description: initialData?.short_description || "",
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

  const handlePromptGenration = async () => {
    try {
      setisPrompting(true);
      const customPrompt = `Write a concise job description for a ${prompt} role in 50 words or fewer, excluding the job title, and only provide the description.`;

      const response = await getGenerativeAIResponse(customPrompt);

      // Trim response to max 50 words and remove the job title part (optional)
      const wordLimited = response.split(" ").slice(0, 50).join(" ");

      // Remove the job title if it exists at the start
      const cleanDescription = wordLimited.replace(/^.*?:\s*/, "");

      // Set the cleaned description to the form field
      form.setValue("short_description", cleanDescription);

      // Trigger validation after setting the value
      await form.trigger("short_description");

      setisPrompting(false);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setisPrompting(false);
    }
  };

  return (
    <div className="mt-6 border rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Short Description
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
        <p className="text-sm mt-2 text-muted-foreground">
          {initialData?.short_description}
        </p>
      )}

      {isEditing && (
        <>
          <div className="flex items-center gap-2 my-2">
            <Input
              placeholder="e.g Software Engineer"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-2 rounded-md"
            />

            {isPrompting ? (
              <Button disabled={true}>
                <Loader2 className="h-4 w-4 animate-spin" />
              </Button>
            ) : (
              <Button onClick={handlePromptGenration}>
                <Lightbulb className="h-4 w-4 text-white" />
              </Button>
            )}
          </div>

          <p className="text-sm mt-2 text-muted-foreground">
            Note: You can use the prompt to generate a short description
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 mt-4"
            >
              <FormField
                control={form.control}
                name="short_description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        className="min-h-[120px]"
                        disabled={isSubmitting}
                        placeholder="Short Description about the job"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-2">
                <Button disabled={!isValid || isSubmitting} type="submit" className="text-white">
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </>
      )}
    </div>
  );
};

export default ShortDescriptionForm;
