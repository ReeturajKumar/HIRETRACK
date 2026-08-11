import { getJobs } from '@/actions/get-jobs';
import Box from '@/components/box';
import getDb from '@/lib/db';
import { serializeArray } from '@/lib/serialize';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'
import HomeSearchConatiner from '../_components/HomeSearchConatiner';
import HomeScreenCategoriesContainer from '../_components/HomeScreenCategoriesContainer';
import HomeCompaniesList from '../_components/HomeCompaniesList';
import RecommendedJobsList from '../_components/RecommendedJobsList';
import { CultureSection } from '../_components/CultureSection';
import Footer from '../_components/Footer';
import { HeroSection } from '../_components/HeroSection';
import { FeaturesSection } from '../_components/FeaturesSection';

const DashboardHomePage = async() => {
  const {userId : clerkId} = await auth();
  if(!clerkId) return redirect('/');

  const jobs = await getJobs({})

  const db = await getDb();

  const categoriesDocs = await db.collection("Category").find({}).sort({ createdAt: -1 }).toArray();
  const categories = serializeArray(categoriesDocs.map((c) => ({ ...c, id: c._id.toString() })));

  const companiesDocs = await db.collection("Company").find({}).sort({ createdAt: -1 }).toArray();
  const allJobsDocs = await db.collection("Job").find({}).toArray();
  
  const companies = serializeArray(companiesDocs.map((c) => {
    const companyId = c._id.toString();
    const companyJobsCount = allJobsDocs.filter((j) => j.companyId === companyId).length;
    return { 
      ...c, 
      id: companyId,
      jobsCount: companyJobsCount
    };
  }));

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Hero Section takes 100% full screen width */}
      <HeroSection />
      <FeaturesSection />

      {/* Remaining content is centered with max-width [1500px] and px-4 */}
      <div className="flex flex-col space-y-12 max-w-[1500px] mx-auto w-full px-4 sm:px-6 md:px-10 pt-6 pb-6">
        {/* Categories Section (Hidden for now) */}
        {/* <div className="w-full">
          <HomeScreenCategoriesContainer categories={categories as any}/>
        </div> */}

        <div className="space-y-12 pt-0">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <HomeCompaniesList companies={companies as any}/>
          
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <RecommendedJobsList jobs={jobs as any} userId={clerkId}/>
        </div>
      </div>

      {/* Full-width Culture Section with 5xl centered content from left */}
      <div className="w-full mt-2 mb-8">
        <CultureSection categories={categories as any} />
      </div>

      {/* Footer Container */}
      <div className="flex flex-col max-w-[1500px] mx-auto w-full px-4 sm:px-6 md:px-10 pb-12">
        <Footer/>
      </div>
    </div>
  )
}

export default DashboardHomePage