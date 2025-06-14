import { Button } from '@/components/ui/button';
import db from '@/lib/db';
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

  // Map Clerk ID to your MongoDB User ID
  const user = await db.user.findUnique({
    where: { clerkId },
  });

  if (!user) return redirect("/");

  const companies = await db.company.findMany({
    where: {
      userId: user.id, // ✅ use internal user ID
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCompanies: CompanyColumns[] = companies.map((company) => ({
    id: company.id,
    name: company.name ?? "",
    logo: company.logo ?? "",
    createdAt: company.createdAt
      ? format(company.createdAt, "MMMM do, yyyy")
      : "",
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

