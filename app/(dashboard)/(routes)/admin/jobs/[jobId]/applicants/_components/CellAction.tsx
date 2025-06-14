/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Ban,Loader, Loader2, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";



interface CellActionProps {
  id: string;
  fullName : string
  email : string;
}

export const CellAction = ({id, fullName, email}: CellActionProps) => {
  const [isLoading, setisLoading] = useState(false)
  const [isRejection, setisRejection] = useState(false)


  const sendSelected = async () => {
   setisLoading(true)
    try {
      await axios.post(`/api/sendSelected`, {fullName, email})
      toast.success("Email sent successfully");
      setisLoading(false)
    } catch (error) {
      console.log(error);
    }finally{
      setisLoading(false)
    }
  }


  const sendRejection = async () => {
   setisRejection(true)
    try {
      await axios.post(`/api/sendRejected`, {fullName, email})
      toast.success("Email sent successfully");
      setisRejection(false)
    } catch (error) {
      console.log(error);
    }finally{
      setisRejection(false)
    }
  }
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size={"icon"}><MoreHorizontal className="w-4 h-4"/></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
       {isLoading ? (
         <DropdownMenuItem className="flex items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
         </DropdownMenuItem>
       ): (<DropdownMenuItem onClick={sendSelected} className="flex items-center justify-center">
          <BadgeCheck className="h-4 w-4 mr-2" />
          Selected
         </DropdownMenuItem>
       )}


     {isRejection ? (
         <DropdownMenuItem className="flex items-center justify-center">
          <Loader className="mr-2 h-4 w-4 animate-spin" />
         </DropdownMenuItem>
       ): (<DropdownMenuItem onClick={sendRejection} className="flex items-center justify-center">
          <Ban className="h-4 w-4 mr-2" />
          Rejected
         </DropdownMenuItem>
       )}


        </DropdownMenuContent>
      </DropdownMenu>
  )
}
