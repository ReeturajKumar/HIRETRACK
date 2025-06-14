"use client"

import Box from "@/components/box"
import { Category } from "@/lib/generated/prisma"
import { iconMapping, IconName } from "@/lib/utils"
import { ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import  qs  from 'query-string';

interface HomeScreenCategoriesContainerProps {
  categories: Category[]
}

export const Icon = ({ name }: { name: IconName }) => {
  const IconComponent = iconMapping[name]
  return IconComponent ? <IconComponent className="w-5 h-5 shrink-0" /> : null
}

export const CategoryListItemCard = ({ data }: { data: Category }) => {
  const router = useRouter();
  const handleClick = (categoryId: string) => {
    const href = qs.stringifyUrl({
      url: "/search",
      query: {
        categoryId: categoryId || ""
      }
    })
    router.push(href)
  }
  return (
    <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-neutral-50 dark:bg-[#141416] hover:border-primary hover:text-primary cursor-pointer transition" onClick={() => handleClick(data.id)}>
      <Icon name={data.name as IconName} />
      <span className="text-sm font-medium truncate flex-1">{data.name}</span>
      <ChevronRight className="w-4 h-4" />
    </div>
  )
}

const HomeScreenCategoriesContainer = ({ categories }: HomeScreenCategoriesContainerProps) => {
  return (
    <Box className="flex-col mt-12">
    <div className="w-full flex flex-wrap items-center justify-center gap-4">
        {categories.map((category) => (
          <CategoryListItemCard key={category.id} data={category} />
        ))}
      </div>
    </Box>
  )
}

export default HomeScreenCategoriesContainer
