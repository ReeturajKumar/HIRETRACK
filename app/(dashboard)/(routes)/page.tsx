import { getJobs } from '@/actions/get-jobs';
import Box from '@/components/box';
import db from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'
import HomeSearchConatiner from '../_components/HomeSearchConatiner';
import HomeScreenCategoriesContainer from '../_components/HomeScreenCategoriesContainer';
import HomeCompaniesList from '../_components/HomeCompaniesList';
import RecommendedJobsList from '../_components/RecommendedJobsList';
import Footer from '../_components/Footer';

const DashboardHomePage = async() => {
  const {userId : clerkId} = await auth();
  if(!clerkId) return redirect('/');

  const jobs = await  getJobs({})


  const categories = await db.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  const companies = await db.company.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })
  return (
    <div className='flex-col py-3 px-4 space-y-15'>
      <Box className='flex-col justify-center w-full space-y-4 pt-12'>
        <h2 className='font-sans text-2xl md:text-4xl text-neutral-600 dark:text-white tracking-wider font-bold'>Discover Career Opportunities Tailored for You</h2>
        <p>Find jobs that match your skills, passion, and goals. Browse top companies and apply in minutes.

</p>
      </Box>
            {/* <Box className='relative overflow-hidden h-[50vh] justify-center rounded-lg mt-6'>
        <Image src={Banner} alt="banner" className='w-full h-full object-cover' />
      </Box> */}
      <HomeSearchConatiner/>
      <HomeScreenCategoriesContainer categories={categories}/>
      <HomeCompaniesList companies={companies}/>
      <RecommendedJobsList jobs={jobs.splice(0, 6)} userId={clerkId}/>
      <Footer/>
    </div>
  )
}

export default DashboardHomePage