import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";

const backgroundVariants = cva(
  "rounded-full flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-primary-foreground text-primary",
        success: "bg-success-foreground text-success",
      },
      size: {
        default: "p-2",
        sm: "p-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const iconVariants = cva("", {
  variants: {
    variant: {
      default: "bg-primary-foreground text-primary",
      success: "bg-success-foreground text-success",
    },
    size: {
      default: "h-8 w-8",
      sm: "h-5 w-5",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type BackgroundVariantProps = VariantProps<typeof backgroundVariants>;
type IconVariantProps = VariantProps<typeof iconVariants>;

 interface IconBadgeProps extends BackgroundVariantProps, IconVariantProps {
  icon: LucideIcon;
  iconClassName?: string;
}

export function IconBadge({ icon: Icon, ...props }: IconBadgeProps) {
  return (
    <div className={cn(backgroundVariants(props))}>
     <Icon className={cn(iconVariants(props), props.iconClassName)} />
    </div>
  );
}
