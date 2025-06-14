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
import { Company } from "@/lib/generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Globe, Linkedin, Mail, MapPin, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface CompanySocialFormProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  mail: z.string().min(1, {
    message: "Mail is required",
  }),
  website: z.string().min(1, {
    message: "Website is required",
  }),
  likedIn: z.string().min(1, {
    message: "LikedIn is required",
  }),
  address_line_1: z.string().min(1, {
    message: "Address is required",
  }),
  address_line_2: z.string().min(1, {
    message: "Address is required",
  }),
  city: z.string().min(1, {
    message: "City is required",
  }),
  state: z.string().min(1, {
    message: "State is required",
  }),
  zipcode: z.string().min(1, {
    message: "Zipcode is required",
  }),
});
const CompanySocialForm = ({
  initialData,
  companyId,
}: CompanySocialFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mail: initialData?.mail || "",
      website: initialData?.website || "",
      likedIn: initialData?.likedIn || "",
      address_line_1: initialData?.address_line_1 || "",
      address_line_2: initialData?.address_line_2 || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      zipcode: initialData?.zipcode || "",
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
  return (
    <div className="mt-6 border rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Company Social Links
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
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="col-span-3">
            {initialData.mail && (
              <div className="text-sm text-muted-foreground flex items-center gap-x-2 mb-2">
                <Mail className="w-4 h-4" />
                {initialData.mail}
              </div>
            )}
             {initialData.likedIn && (
              <Link href={initialData.likedIn} target="_blank" className="text-sm text-muted-foreground flex items-center gap-x-2 mb-2">
                <Linkedin className="w-4 h-4" />
                {initialData.likedIn}
              </Link>
            )}

              {initialData.website && (
              <Link href={initialData.website} target="_blank" className="text-sm text-muted-foreground flex items-center gap-x-2 mb-2">
                <Globe className="w-4 h-4" />
                {initialData.website}
              </Link>
            )}

            <div>
              <div className="col-span-3">
                {initialData.address_line_1 && (
                  <div className="flex items-center gap-2 justify-start">
                    <MapPin className="w-4 h-4 " />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {initialData.address_line_1}, {initialData.address_line_2}, 
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {initialData.city}, {initialData.state} - {initialData.zipcode} 
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
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
              name="mail"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="zoho@zoho.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="https://www.zoho.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="likedIn"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="https://www.linkedin.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="address_line_1"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="Address Line"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address_line_2"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="Address Line"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="City"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="State"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zipcode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="Zipcode"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

export default CompanySocialForm;
