"use client";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface SidebarRouteItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

export const SidebarRouteItem = ({
  icon: Icon,
  label,
  href,
}: SidebarRouteItemProps) => {
  const pathName = usePathname();
  const router = useRouter();

  const isActive =
    (pathName === "/" && href === "/") ||
    pathName === href ||
    pathName.startsWith(`${href}/`);

  const onClick = () => {
    router.push(href);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-between w-full pl-6 pr-3 py-4 transition-all hover:bg-primary/10",
        isActive && "bg-primary/10 text-primary"
      )}
    >
      {/* Icon + Label */}
      <div className="flex items-center gap-x-4">
        <Icon
          size={22}
          className={isActive ? "text-primary" : "text-muted-foreground"}
        />
        <p
          className={cn(
            "text-sm font-medium",
            isActive ? "text-primary" : "text-muted-foreground"
          )}
        >
          {label}
        </p>
      </div>

      {/* Active indicator */}
      <div
        className={cn(
          "opacity-0 transition-all h-full",
          isActive && "opacity-100"
        )}
      >
        <div className="h-5 w-1 rounded-full bg-primary" />
      </div>
    </button>
  );
};
