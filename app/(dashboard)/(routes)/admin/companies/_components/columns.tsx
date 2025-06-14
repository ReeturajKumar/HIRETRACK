"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";
import Image from "next/image";


export type CompanyColumns = {
  id: string;
  name: string;
  logo: string;
  createdAt: string;
};

export const columns: ColumnDef<CompanyColumns>[] = [
{
  accessorKey: "logo",
  header: "Logo",
  cell: ({ row }) => {
    const { logo } = row.original;
    return (
      <div className="flex items-center gap-x-2 overflow-hidden rounded-md w-20 h-20">
        <Image src={logo} alt=""  width={40} height={40} className="w-20 h-  object-contain fill" />
      </div>
    )
  }
},

  {
    accessorKey: "name",
   header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
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
         <Link href={`/admin/companies/${id}`} className="cursor-pointer">
         <DropdownMenuItem><Pencil className="mr-2 h-4 w-4 cursor-pointer" />Edit</DropdownMenuItem>
         </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
},

];
