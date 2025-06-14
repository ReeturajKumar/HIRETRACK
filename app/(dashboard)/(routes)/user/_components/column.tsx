"use client"

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye } from "lucide-react"
import { Button } from "@/components/ui/button";
import Link from "next/link";


export type AppliedJobscolumns = {
  id: string;
  title: string;
  company: string;
  category: string;
  appliedAt: string;
};

export const columns: ColumnDef<AppliedJobscolumns>[] = [
{
  accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
},

  {
    accessorKey: "category",
   header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },

    {
    accessorKey: "company",
   header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Company
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "appliedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Applied At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
  id: "actions",
  cell: ({ row }) => {
    const { id } = row.original;
    return (
      <Link href={`/search/${id}`}>
        <Button variant={"ghost"} size={"icon"}>
          <Eye className="w-4 h-4"/></Button>
      </Link>
    );
  },
},

];
