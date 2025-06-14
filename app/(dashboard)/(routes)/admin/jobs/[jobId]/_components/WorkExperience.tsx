"use client";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combo-box";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Job } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface WorkExperienceProps {
  initialData: Job;
  jobId: string;
}

const options = [
  {
    value: "0-1-years",
    label: "Fresher",
  },
  {
    value: "1-3-years",
    label: "1-3 Years",
  },
  {
    value: "3-5-years",
    label: "3-5 Years",
  },
  {
    value: "5-plus-years",
    label: "5+ Years",
  }
  
]

const formSchema = z.object({
  yearsOfExperience: z.string().min(1),
});
const WorkExperience = ({ initialData, jobId}: WorkExperienceProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      yearsOfExperience: initialData?.yearsOfExperience || "",  
    }
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


  const selectedOptions = options.find((option) => option.value === initialData.yearsOfExperience);
  return (
    <div className="mt-6 border rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Work Experience 
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

      {!isEditing && <p className={cn("text-sm mt-2", !selectedOptions && "text-muted-foreground")}>{selectedOptions?.label || "No Experience Selected"}</p>}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="yearsOfExperience"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox options={options} heading=  "Select Years of Experience" {...field} />
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

export default WorkExperience;