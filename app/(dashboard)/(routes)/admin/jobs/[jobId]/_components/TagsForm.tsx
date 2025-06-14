/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import getGenerativeAIResponse from "@/scripts/aistudio";
import { Job } from "@/lib/generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Lightbulb, Loader2, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
interface TagsFormProps {
  initialData: Job;
  jobId: string;
}

const formSchema = z.object({
  tags: z.array(z.string().min(1)),
});
const TagsForm = ({
  initialData,
  jobId,
}: TagsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isPrompting, setisPrompting] = useState(false);
  const [jobTags, setJobTags] = useState<string[]>((initialData.tags));
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tags: initialData?.tags || "",
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
    const customPrompt = `Generate an array of top 25 keywords related to the job profession of "${prompt}". These keywords should encompass various aspects of the profession, including skills, responsibilities, tools, and technologies commonly associated with it. Aim for a diverse set of keywords that accurately represent the breadth of the profession. Your output should be a list/array of keywords. Just return the array alone.`;

    await getGenerativeAIResponse(customPrompt).then((data) => {
      // Remove any code block markers like ```json, ```javascript, etc.
      data = data.replace(/```[a-z]*|```/gi, "").trim();

      // Extract the first JSON array from the response
      const match = data.match(/\[.*\]/s);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (Array.isArray(parsed)) {
          setJobTags((prevTags) => [...prevTags, ...parsed]);
        }
      } else {
        toast.error("Could not parse tags from AI response");
      }

      setisPrompting(false);
    });
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
    setisPrompting(false);
  }
};


  const handleTagRemove = (index: number) => {
    const updatedTags = [...jobTags];
    updatedTags.splice(index, 1);
    setJobTags(updatedTags);
  };

  return (
    <div className="mt-6 border rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Tags
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
  <div className="flex flex-wrap gap-2 mt-2">
    {initialData?.tags?.length === 0 ? (
      <p className="text-sm text-muted-foreground">No Tags</p>
    ) : (
      initialData.tags.map((tag: string, index: number) => (
        <span
          key={index}
          className="text-sm dark:bg-[#141416] px-2 bg-gray-300 py-1 rounded-full"
        >
          #{tag}
        </span>
      ))
    )}
  </div>
)}


      {!isEditing && (
        <p className="text-sm mt-2 text-muted-foreground"></p>
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
            Note: Profession Name alone enough to generate the tags
          </p>

          <div className="flex items-center gap-2 mt-4 flex-wrap">
              {jobTags.length > 0 ? (jobTags.map((tag,index) => (
            <div key={index} className="text-xs flex items-center gap-1 whitespace-nowrap p-2 rounded-md dark:bg-[#141416] bg-gray-300">{tag}{" "} {isEditing && (
              <Button variant={"ghost"} className="p-0 h-auto" onClick={() => handleTagRemove(index)}>
                <X className="w-4 h-4" />
              </Button>
            )}</div>
          ))) : <p>No Tags</p>}
          </div>


          <div className="flex items-center gap-3 justify-end">
            <Button type="button" variant={"outline"} onClick={() => {
              setJobTags([]) 
            onSubmit({ tags: [] })}} disabled={isSubmitting}>Clear All</Button>
            <Button type="submit" disabled={isSubmitting} onClick={() => onSubmit({ tags: jobTags })} className="text-white"> Save</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default TagsForm;
