"use client";

import Link from "next/link";
import Image from "next/image";
import { MobileSidebar } from "./MobileSidebar";
import { NavbarRoutes } from "./NavbarRoutes";
import { NavbarMenu } from "./NavbarMenu";

export const Navbar = () => {
  return (
    <header className="relative w-full bg-white dark:bg-neutral-950 shadow-none border-none">

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <nav
          className="flex items-center justify-between gap-4 py-2.5"
          aria-label="Main navigation"
        >
          {/* Left: mobile menu + logo */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <MobileSidebar />
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <Image
                height={28}
                width={28}
                alt="HireTrack"
                src="/logo.png"
                className="object-contain hidden sm:block"
              />
              <span className="text-xl font-medium tracking-tight text-neutral-900 lowercase dark:text-neutral-50 group-hover:opacity-80 transition-opacity font-sans">
                hiretrack
              </span>
            </Link>
          </div>

          {/* Center-right: nav links (desktop) */}
          <NavbarMenu />

          {/* Right: auth / user actions */}
          <NavbarRoutes />
        </nav>
      </div>
    </header>
  );
};
