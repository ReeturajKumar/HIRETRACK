"use client";

import { Navbar } from "./_components/Navbar";

export const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <header className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </header>

      <main className="pt-[3.8rem] h-full">
        {children}
      </main>
    </div>
  );
};
