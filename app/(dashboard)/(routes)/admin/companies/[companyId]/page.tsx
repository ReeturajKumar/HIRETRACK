/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'

import { IconBadge } from '@/components/icon-badge'
import Link from 'next/link'
import { ArrowLeft, LayoutDashboard, Network} from 'lucide-react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import db from '@/lib/db'
import CompanyNameForm from './_components/NameForm'
import CompanyDescriptionForm from './_components/CompanyDescription'
import LogoForm from './_components/LogoForm'
import CompanySocialForm from './_components/CompanySocial'
import CompanyCover from './_components/CompanyCover'
import CompanyOverViewForm from './_components/CompanyOverview'
import CompanyWhyJoinUsForm from './_components/CompanyWhyJoinUs'

// --- CHANGE 1: Update PageProps type to include Promise ---
type PageProps = {
  params: Promise<{
    companyId: string;
  }>;
};

// Your component is already async, which is great!
const CompanyEditPage = async ({ params }: PageProps) => {
    // --- CHANGE 2: Await params to get the actual object ---
    const resolvedParams = await params; // Resolve the promise
    const companyId = resolvedParams.companyId; // Access the ID from the resolved object

    const validateObjectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!validateObjectIdRegex.test(companyId)) { // Use companyId here
      return redirect("/admin/companies");
    }

    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return redirect("/");
    }

    const user = await db.user.findUnique({
      where: {
        clerkId,
      },
    });

    if (!user) {
      return redirect("/");
    }

    const company = await db.company.findUnique({
      where: {
        id: companyId, // Use companyId here
        userId: user.id,
      },
    });


    if (!company) {
      return redirect("/admin/companies");
    }

    const requiredFields = [
      company.name,
      company.description,
      company.logo,
      company.coverImage,
      company.mail,
      company.website,
      company.likedIn,
      company.address_line_1,
      company.city,
      company.state,
      company.zipcode,
      company.overview,
      company.whyJoinUs
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `${completedFields} / ${totalFields}`;

    const isComplete = requiredFields.every(Boolean);
  return (
        <div className="p-6">
          <Link href="/admin/companies">
            <div className="flex items-center gap-3 text-muted-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back
            </div>
          </Link>

          <div className="flex items-center justify-between my-4">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Company SetUp</h1>
              <span className="text-muted-foreground text-sm">
                Complete All Fields: {completionText}
              </span>
            </div>
          </div>


          {/* container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <div>
              <div className="flex items-center gap-x-3">
                <IconBadge icon={LayoutDashboard} iconClassName="dark:text-white"  />
                <h2 className="text-xl font-medium">Customize Your Company</h2>
              </div>

              {/* name form */}
              <CompanyNameForm initialData={company} companyId={company.id} />

              <CompanyDescriptionForm initialData={company} companyId={company.id} />

              <LogoForm initialData={company} companyId={company.id} />
            </div>

            <div className="space-y-6">
              <div>
                <div className='flex items-center gap-x-3'>
                  <IconBadge icon={Network} iconClassName="dark:text-white" />
                  <h2 className="text-xl font-medium">Connect With Us</h2>
                </div>
                <CompanySocialForm initialData={company} companyId={company.id} />
                <CompanyCover initialData={company} companyId={company.id} />
              </div>
            </div>

            <div className='col-span-2'>
              <CompanyOverViewForm initialData={company} companyId={company.id} />

              <CompanyWhyJoinUsForm initialData={company} companyId={company.id} />
            </div>
          </div>
        </div>
    )
}

export default CompanyEditPage