"use client";
import { Button } from "@/components/ui/button";
import { LogOut} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { SearchContainer } from "@/components/SearchContainer";

export const NavbarRoutes = () => {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);

  const isAdminPage = pathname.startsWith("/admin");
  const isClientPage = pathname.startsWith("/jobs");
  const isSearchPage = pathname.startsWith("/search");

  useEffect(() => {
    const fetchUserRole = async () => {
    const response = await fetch("/api/get-user-role");
      const data = await response.json();

      if (data?.role) {
        setUserRole(data.role); // Set user role in state
      }
    };

    fetchUserRole();
  }, []);

  return (
    <>
    {
      isSearchPage && (
       <div className="hidden md:flex w-full px-2 pr-8 items-center gap-x-6">
        <SearchContainer/>
       </div>
      )
    }
      <div className="flex gap-x-2 ml-auto">
        <ThemeToggle />
        {isAdminPage || isClientPage ? (
          <Link href={"/"}>
            <Button variant={"outline"} size={"lg"} className="bg-primary text-white">
              <LogOut className="" />
              Exit
            </Button>
          </Link>
        ) : (
          userRole === "admin" && (
            <Link href={"/admin/jobs"}>
              <Button size={"lg"} className="bg-primary text-white mr-3 ml-3">
                Admin Panel
              </Button>
            </Link>
          )
        )}
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
};
