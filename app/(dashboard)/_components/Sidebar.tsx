import React from "react";
import { SidebarRoutes } from "./SidebarRoutes";
import Link from "next/link";

export const Sidebar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-transparent">
      <div className="p-6">
       <Link href="/">
       <h1 className="text-3xl font-bold">
          HIRE<span className="text-primary">TRACK</span>
        </h1>
       </Link>
      </div>


      {/* sidebar links */}
      <div className="flex flex-col w-full">
        <SidebarRoutes/>
      </div>
    </div>
  );
};
