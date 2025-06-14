"use clinet";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import React from "react";

interface CustomeBreadCrummbProps {
  breadCrumbPage: string;
  createCrumbItem: { link: string; label: string }[];
}

export const CustomeBreadCrummb = ({
  breadCrumbPage,
  createCrumbItem,
}: CustomeBreadCrummbProps) => {
  return (
     <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="flex items-center justify-center">
            <Home className="mr-2 h-4 w-4" /> Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        {createCrumbItem.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={item.link}>{item.label}</BreadcrumbLink>
            </BreadcrumbItem>
          </React.Fragment>
        ))}

        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{breadCrumbPage}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
