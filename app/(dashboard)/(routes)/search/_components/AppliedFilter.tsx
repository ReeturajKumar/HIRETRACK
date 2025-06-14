/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export const AppliedFilter = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();


   const currentParams = Object.fromEntries(searchParams.entries());

   const shiftTimingParams = Object.fromEntries(
    Object.entries(currentParams).filter(([key]) => key.startsWith("employmentType"))
   );


      const workingMOde = Object.fromEntries(
    Object.entries(currentParams).filter(([key]) => key.startsWith("workMode"))
   );


   if(searchParams.size === 0) return null


  return <>
  <div className="mt-4 flex items-center gap-4">
    {shiftTimingParams && Object.entries(shiftTimingParams).map(([key, value]) =>(
      <>
      {value.split(",").map((item) => (
        <Button variant={"outline"} type="button" key={item} className="flex items-center gap-2 text-muted-foreground px-2 py-1 rounded-md  border-primary capitalize cursor-pointer hover:bg-primary dark:hover:bg-primary  hover:text-white">
         {item}
        </Button>
      ))}
      </>
    ))}



        {workingMOde && Object.entries(workingMOde).map(([key, value]) =>(
      <>
      {value.split(",").map((item) => (
        <Button variant={"outline"} type="button" key={item} className="flex items-center gap-2 text-muted-foreground px-2 py-1 rounded-md  border-primary capitalize cursor-pointer hover:bg-primary dark:hover:bg-primary  hover:text-white">
         {item}
        </Button>
      ))}
      </>
    ))}
  </div>


  {
    searchParams.get("title") && (
     <div className="flex items-center justify-center flex-col my-4">
      <h2 className="text-3xl font-bold text-muted-foreground">
       You Search For : {" "}
       <span className="font-bold text-primary capitalize"> {searchParams.get("title")}</span>
      </h2>
     </div>
    )
  }
  
  </>
}
