"use client"

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import qs from "query-string";

interface CategoryListItemProps {
  label : string;
  value : string
}

const CategoryListItem = ({label, value} : CategoryListItemProps) => {

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");


  const isSeected = currentCategoryId === value

  const onClick = () => {
    const url = qs.stringifyUrl({
      url: pathname,
      query: {
        categoryId: isSeected ? null : value,
        title: currentTitle
      }
    },{
        skipNull: true,skipEmptyString: true
   })

   router.push(url)
  }


  return <Button type="button" variant={"outline"} onClick={onClick} className={cn(" whitespace-nowrap text-sm tracking-wider text-muted-foreground border px-2 py-[4px] rounded-md hover:bg-primary hover:dark:bg-primary hover:text-white transition cursor-pointer hover:shadow-sm", isSeected && "bg-primary dark:bg-primary dark:text-white text-white")}>
    {label}
  </Button>
}

export default CategoryListItem