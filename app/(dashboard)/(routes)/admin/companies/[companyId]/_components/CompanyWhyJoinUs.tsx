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
import { Company } from "@/lib/generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Lightbulb, Loader2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import getGenerativeAIResponse from "@/scripts/aistudio";
import CompanyPreviewWhyJoinUs from "./CompanyPreviewJoinUs";
interface CompanyWhyJoinUsProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  whyJoinUs: z.string().min(1),
});
const CompanyWhyJoinUsForm = ({
  initialData,
  companyId,
}: CompanyWhyJoinUsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [rollname, setRollname] = useState("");
  const [isPrompting, setisPrompting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      whyJoinUs: initialData?.whyJoinUs || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/companies/${companyId}`, values);
      toast.success("Company Updated Successfully!");
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
    if (!rollname) {
      toast.error("Please enter re  quired filed.");
      return;
    }

    try {
      setisPrompting(true);

      const prompt = `Write a compelling and professional "Why Join Us" section for a company named ${rollname}. Highlight the unique value propositions, mission, culture, and benefits that make ${rollname} an exceptional place to work or collaborate with. Focus on attracting top talent, innovators, or partners by emphasizing:

The company’s vision and impact

Growth opportunities and career development

Inclusive and inspiring work culture

Innovation, technology, or creative edge

Any standout benefits or perks

The tone should be persuasive, engaging, and aligned with a modern, forward-thinking organization. Avoid clichés — focus on what truly sets ${rollname} apart from other companies in its space.

Ensure the content is written in a way that is easy to understand and digest.`;

      const response = await getGenerativeAIResponse(prompt);

      // Directly set the response as is, ensuring proper Markdown formatting
      form.setValue("whyJoinUs", response.trim());
      await form.trigger("whyJoinUs");
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
        Why Join US 
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
          <CompanyPreviewWhyJoinUs whyJoinUs={initialData?.whyJoinUs || ""} />
        </div>
      )}

      {isEditing && (
        <>
          <div className="flex items-center gap-2 my-2">
            <Input
              placeholder="Enter Company Name"
              type="text"
              value={rollname}
              onChange={(e) => setRollname(e.target.value)}
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
            Note: You can use the prompt to generate a reason to join the
            company.
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 mt-4"
            >
              <FormField
                control={form.control}
                name="whyJoinUs"
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

export default CompanyWhyJoinUsForm;
