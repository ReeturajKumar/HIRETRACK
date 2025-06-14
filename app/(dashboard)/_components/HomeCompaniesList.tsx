"use client"
import Box from '@/components/box';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Company } from '@/lib/generated/prisma';
import { useRouter } from 'next/navigation';

interface HomeCompaniesListProps {
  companies: Company[]
}

const CompanyListItemCard = ({data} : {data: Company}) => {
    const router = useRouter();
  return(
   <Card className="w-full sm:w-[280px] md:w-[320px] lg:w-[340px] bg-white dark:bg-[#141416] border   rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 cursor-pointer" onClick={() => router.push(`/companies/${data.id}`)}>
      <CardHeader className="p-0 space-y-2">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">{data.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-3">
          {data.description}
        </CardDescription>
      </CardHeader>
    </Card>


  )
}

const HomeCompaniesList = ({companies} : HomeCompaniesListProps) => {
  return (
    <Box className='flex-col my-12'>
      <h2 className='font-sans text-2xl text-neutral-600 dark:text-white tracking-wider font-semibold'>
        Trusted Industry Leaders Actively Recruiting
      </h2>
      <p className='text-muted-foreground text-sm'>Discover top companies that are actively seeking talented individuals for their team</p>

      <div className='mt-15 w-full flex items-center justify-center flex-wrap gap-6'>
        {companies.map(company => (
          <CompanyListItemCard key={company.id} data={company} />
        ))}
      </div>
    </Box>
  )
}

export default HomeCompaniesList