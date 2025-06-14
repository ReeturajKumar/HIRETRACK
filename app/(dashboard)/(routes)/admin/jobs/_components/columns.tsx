"use client";

import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";


export type JobsColumns = {
  id: string;
  title: string;
  company: string;
  category: string;
  createdAt: string;
  isPublished: boolean;
};

export const columns: ColumnDef<JobsColumns>[] = [
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
    accessorKey: "isPublished",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const { isPublished } = row.original;
      return (
        <div
          className={cn(
            "border px-2 py-1 rounded-md text-xs w-24 text-center",
            isPublished ? "bg-primary text-white" : " bg-primary text-white"
          )}
        >
          {isPublished ? "Published" : "UnPublished"}
        </div>
      );
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
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size={"icon"}><MoreHorizontal className="w-4 h-4"/></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
         <Link href={`/admin/jobs/${id}`} className="cursor-pointer">
         <DropdownMenuItem><Pencil className="mr-2 h-4 w-4 cursor-pointer" />Edit</DropdownMenuItem>
         </Link>

          <Link href={`/admin/jobs/${id}/applicants`} className="cursor-pointer">
         <DropdownMenuItem>
          <Eye className="mr-2 h-4 w-4 cursor-pointer" />
          Applicants
         </DropdownMenuItem>
         </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
},

];
