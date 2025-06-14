"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, File } from "lucide-react"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CellAction } from "./CellAction";


export type ApplicantsColumns = {
  id: string;
  fullname: string;
  email: string;
  contact: string;
  appliedAt: string;
  resume: string;
  resumeName:string
};

export const columns: ColumnDef<ApplicantsColumns>[] = [
  {
    accessorKey: "fullname",
   header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  
  {
    accessorKey: "email",
   header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "contact",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Contact
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "resume",
    header: "Resume",
    cell: ({row}) => {
      const {resume,resumeName} = row.original
      return (
        <Link href={resume} target="_blank" className="flex items-center text-primary">
          <File className="size-4 mr-2" />
          <p className="w-44 truncate">{resumeName}</p>
        </Link>
      )
    }
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
    const { id, fullname, email } = row.original;
    return <CellAction id={id} fullName={fullname} email={email}/>
  },
},

];
