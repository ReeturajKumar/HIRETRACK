"use client"

import { Category } from "@/lib/generated/prisma"
import CategoryListItem from "./CategoryListItem"

interface CategoriesListProps {
  categories : Category[]
}

export const CategoriesList = ({categories} : CategoriesListProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
       <CategoryListItem key={category.id} label={category.name} value={category.id} />
      ))}
    </div>
  )
}
