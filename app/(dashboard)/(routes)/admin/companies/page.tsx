import { Button } from '@/components/ui/button';
import getDb from '@/lib/db';

import { auth } from '@clerk/nextjs/server';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { columns, CompanyColumns } from './_components/columns';
import { format } from 'date-fns';
import { DataTable } from '@/components/ui/data-table';

const CompaniesOverviewPage = async () => {
  const { userId: clerkId } = await auth();

  if (!clerkId) return redirect("/");

  const db = await getDb();
  const mongoUser = await db.collection("User").findOne({ clerkId });
  if (!mongoUser) return redirect("/");

  const companiesDocs = await db
    .collection("Company")
    .find({ userId: mongoUser._id.toString() })
    .sort({ createdAt: -1 })
    .toArray();

  const formattedCompanies: CompanyColumns[] = companiesDocs.map((company) => ({
    id: company._id.toString(),
    name: company.name ?? "",
    logo: company.logo ?? "",
    createdAt: company.createdAt ? format(company.createdAt, "MMMM do, yyyy") : "",
  }));

  return (
    <div className="p-6">
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/admin/companies/create" className='text-white'>
            <Plus className="w-5 h-5 " />
            New Company
          </Link>
        </Button>
      </div>

      <div className="mt-6">
        {formattedCompanies.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No companies found. Start by creating one.
          </p>
        ) : (
          <DataTable columns={columns} data={formattedCompanies} searchKey="name" />
        )}
      </div>
    </div>
  );
};

export default CompaniesOverviewPage;
