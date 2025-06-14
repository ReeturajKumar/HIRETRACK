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
// import getGenerativeAIResponse from "@/scripts/aistudio";
import { Job } from "@/lib/generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Lightbulb, Loader2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import getGenerativeAIResponse from "@/scripts/aistudio";
import JobDescriptionPreview from "@/components/preview";
interface JobDescriptionProps {
  initialData: Job;
  jobId: string;
}

const formSchema = z.object({
  description: z.string().min(1),
});
const JobDescriptionForm = ({ initialData, jobId }: JobDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [rollname, setRollname] = useState("");
  const [skills, setSkills] = useState("");
  const [isPrompting, setisPrompting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || "",
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
  if (!rollname || !skills) {
    toast.error("Please enter both role and required skills.");
    return;
  }

  try {
    setisPrompting(true);

    const prompt = `Write a detailed and well-formatted job description for a ${rollname} role. Include the following required skills: ${skills}. The description should have the following:
    - Use bullet points for responsibilities and qualifications.
    - Each section (Responsibilities, Qualifications, Preferred Experience) should be in its own heading with a Markdown header (# for major section titles).
    - Use paragraphs and line breaks as necessary to separate content.`;

    const response = await getGenerativeAIResponse(prompt);

    // Directly set the response as is, ensuring proper Markdown formatting
    form.setValue("description", response.trim());
    await form.trigger("description");
    
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong while generating the description.");
  } finally {
    setisPrompting(false);
  }
};


  return (
    <div className="mt-6 border rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Description
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
  <div className="mt-4">
    
    <JobDescriptionPreview description={initialData?.description || ""} />
    
  </div>
)}


      {isEditing && (
        <>
          <div className="flex items-center gap-2 my-2">
            <Input
              placeholder="e.g Software Engineer"
              type="text"
              value={rollname}
              onChange={(e) => setRollname(e.target.value)}
              className="w-full p-2 rounded-md"
            />

            <Input
              placeholder="Required Skills"
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
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
            Note: You can use the prompt to generate a description
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 mt-4"
            >
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea {...field} />
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

export default JobDescriptionForm;
