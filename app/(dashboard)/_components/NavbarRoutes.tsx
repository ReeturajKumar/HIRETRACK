"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const navLinkClass =
  "text-[13px] sm:text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors dark:text-neutral-400 dark:hover:text-neutral-50";

const brutalButtonClass =
  "inline-flex items-center justify-center rounded-lg border border-neutral-950 bg-white px-5 py-2 text-[13px] sm:text-sm font-medium text-neutral-950 shadow-[3px_3px_0px_0px_#000000] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000000] active:translate-y-0 active:shadow-[2px_2px_0px_0px_#000000] dark:border-neutral-50 dark:bg-neutral-900 dark:text-neutral-50 dark:shadow-[3px_3px_0px_0px_#ffffff] dark:hover:shadow-[4px_4px_0px_0px_#ffffff] dark:active:shadow-[2px_2px_0px_0px_#ffffff]";

export const NavbarRoutes = () => {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);

  const isAdminPage = pathname.startsWith("/admin");

  useEffect(() => {
    const fetchUserRole = async () => {
      const response = await fetch("/api/get-user-role");
      const data = await response.json();
      if (data?.role) setUserRole(data.role);
    };
    fetchUserRole();
  }, []);

  return (
    <div className="flex items-center gap-4 sm:gap-6 shrink-0 md:ml-auto">
      <SignedOut>
        <SignInButton mode="modal">
          <button type="button" className={navLinkClass}>
            Sign In
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button type="button" className={brutalButtonClass}>
            Sign up Free
          </button>
        </SignUpButton>
      </SignedOut>

      <SignedIn>
        {isAdminPage ? (
          <Link href="/" className={cn(brutalButtonClass, "gap-1.5")}>
            <LogOut className="h-4 w-4" />
            Exit
          </Link>
        ) : (
          userRole === "admin" && (
            <Link href="/admin/jobs" className={cn(brutalButtonClass, "hidden sm:inline-flex")}>
              Admin Panel
            </Link>
          )
        )}
        <UserButton
          afterSignOutUrl="/sign-in"
          appearance={{
            elements: {
              avatarBox: "h-9 w-9 ring-2 ring-neutral-200 dark:ring-neutral-700",
            },
          }}
        />
      </SignedIn>
    </div>
  );
};
