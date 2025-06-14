"use client"

import { Search, X } from "lucide-react"
import { Input } from "./ui/input"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebounce } from "@/hooks/use-debounce"
import qs from "query-string"

export const SearchContainer = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();


  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");
  const createdAtFilter = searchParams.get("createdAtFilter");
  const currentShiftTiming = searchParams.get("employmentType");
  const currentWorkMode = searchParams.get("workMode");

  const [value, setValue] = useState(currentTitle || "");
  const debouncedValue = useDebounce(value);

  useEffect(() => {
    const url = qs.stringifyUrl({
      url: pathname,
      query : {
        title: debouncedValue,
        categoryId: currentCategoryId,
        createdAtFilter: createdAtFilter,
        employmentType: currentShiftTiming,
        workMode: currentWorkMode
      }
    },{skipNull: true,skipEmptyString: true})
    router.push(url);
  }, [debouncedValue, router, currentCategoryId, pathname, createdAtFilter, currentShiftTiming, currentWorkMode]);
  return (
    <>
    <div className="flex items-center gap-x-2 relative flex-1">
      <Search className="w-4 h-4 text-muted-foreground absolute left-3" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search For a Job Using Title"
        className="pl-10 bg-primary/10 rounded-lg w-full focus-visible:ring-0 focus-visible:ring-offset-0 h-12"
      />
      {
        value && (
          <Button variant={"ghost"} size={"icon"} type="button" onClick={() => setValue("")} className="absolute right-3 cursor-pointer hover:scale-125 hover:bg-transparent">
            <X className="w-4 h-4" />
          </Button>
        )
      }
    </div>
    </>
  )
}