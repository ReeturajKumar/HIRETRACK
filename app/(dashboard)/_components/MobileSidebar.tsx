import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { NavbarMenu } from "./NavbarMenu";
import { FilterContainer } from "./FilterContainer";

export const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="md:hidden p-1.5 -ml-1 rounded-lg text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent className="p-6 w-[280px]" side="left">
        <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-6">
          Menu
        </p>
        <div className="flex flex-col gap-y-6">
          <NavbarMenu vertical />
          <FilterContainer />
        </div>
      </SheetContent>
    </Sheet>
  );
};
