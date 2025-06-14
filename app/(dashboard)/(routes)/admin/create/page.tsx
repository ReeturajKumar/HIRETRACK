"use client";
import {useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form, 
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios  from 'axios';
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Job title is required",
  }),
});

const JobCreatePage = () => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const {isSubmitting,isValid} = form.formState;
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/jobs", values);
      router.push(`/admin/jobs/${response.data.id}`);
      toast.success("Job Created Successfully!"); 
    } catch (error) {
      console.log((error as Error)?.message);
    }
  };
  return (
    <div className="max-w-5xl mx-auto flex items-center justify-center h-full">

      <div className="">
        <h1 className="text-2xl">Name Your Job</h1>
        <p className="text-muted-foreground text-sm">
          What would you like to call this job ? Don&apos;t worry, you can
          always change it later
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Frontend Developer"
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Role of the Job</FormDescription>
                  <FormMessage/>
                </FormItem>
              )}
            ></FormField>
            <div className="flex justify-between">
              <Link href={"/admin/jobs"}>
              <Button variant={"outline"} type="button">
                Cancel
              </Button>
              </Link>

              <Button disabled={!isValid || isSubmitting} type="submit" className="text-white" >
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default JobCreatePage;
