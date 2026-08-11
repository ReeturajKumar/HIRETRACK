/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { IconBadge } from '@/components/icon-badge'
import Link from 'next/link'
import { ArrowLeft, LayoutDashboard, Network} from 'lucide-react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import getDb from '@/lib/db'
import { serialize } from '@/lib/serialize'
import { ObjectId } from 'mongodb'
import CompanyNameForm from './_components/NameForm'
import CompanyDescriptionForm from './_components/CompanyDescription'
import LogoForm from './_components/LogoForm'
import CompanySocialForm from './_components/CompanySocial'
import CompanyCover from './_components/CompanyCover'
import CompanyOverViewForm from './_components/CompanyOverview'
import CompanyWhyJoinUsForm from './_components/CompanyWhyJoinUs'

type PageProps = {
  params: Promise<{ companyId: string }>;
};

const CompanyEditPage = async ({ params }: PageProps) => {
  const { companyId } = await params;

  const validateObjectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!validateObjectIdRegex.test(companyId)) return redirect("/admin/companies");

  const { userId: clerkId } = await auth();
  if (!clerkId) return redirect("/");

  const db = await getDb();
  const mongoUser = await db.collection("User").findOne({ clerkId });
  if (!mongoUser) return redirect("/");

  const companyDoc = await db.collection("Company").findOne({
    _id: new ObjectId(companyId),
    userId: mongoUser._id.toString(),
  });

  if (!companyDoc) return redirect("/admin/companies");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const company: any = serialize({ ...companyDoc, id: companyDoc._id.toString() });

  const requiredFields = [
    company.name, company.description, company.logo, company.coverImage,
    company.mail, company.website, company.likedIn, company.address_line_1,
    company.city, company.state, company.zipcode, company.overview, company.whyJoinUs
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
          <span className="text-muted-foreground text-sm">Complete All Fields: {completionText}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-3">
            <IconBadge icon={LayoutDashboard} iconClassName="dark:text-white" />
            <h2 className="text-xl font-medium">Customize Your Company</h2>
          </div>
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