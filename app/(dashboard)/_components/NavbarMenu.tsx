"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminRoutes } from "./FilterContainer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const findJobsLinks = [
  { label: "Browse Jobs", href: "/search" },
  { label: "Saved Jobs", href: "/savedJobs" },
  { label: "My Profile", href: "/user" },
];

const navLinkClass =
  "text-[13px] sm:text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors dark:text-neutral-400 dark:hover:text-neutral-50";

const activeLinkClass =
  "text-neutral-950 dark:text-neutral-50 font-semibold";

export const NavbarMenu = ({ vertical = false }: { vertical?: boolean }) => {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");

  const isFindJobsActive =
    pathname.startsWith("/search") ||
    pathname.startsWith("/savedJobs") ||
    pathname === "/user";

  const isCompaniesActive =
    pathname === "/" || pathname.startsWith("/companies");

  if (vertical) {
    return (
      <div className="flex flex-col gap-y-3">
        {findJobsLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              navLinkClass,
              pathname === link.href || pathname.startsWith(`${link.href}/`)
                ? activeLinkClass
                : ""
            )}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/"
          className={cn(navLinkClass, isCompaniesActive && activeLinkClass)}
        >
          For Companies
        </Link>
        {isAdminPage &&
          adminRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                navLinkClass,
                pathname.startsWith(route.href) && activeLinkClass
              )}
            >
              {route.label}
            </Link>
          ))}
      </div>
    );
  }

  if (isAdminPage) {
    return (
      <div className="hidden md:flex items-center gap-8 md:ml-auto">
        {adminRoutes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              navLinkClass,
              pathname.startsWith(route.href) && activeLinkClass
            )}
          >
            {route.label}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center gap-8 md:ml-auto">
      {findJobsLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            navLinkClass,
            (pathname === link.href || pathname.startsWith(`${link.href}/`)) && activeLinkClass
          )}
        >
          {link.label}
        </Link>
      ))}

      <Link
        href="/"
        className={cn(navLinkClass, isCompaniesActive && activeLinkClass)}
      >
        For Companies
      </Link>
    </div>
  );
};
