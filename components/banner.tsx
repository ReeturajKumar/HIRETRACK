import { cn } from "@/lib/utils"
import {cva, type VariantProps} from "class-variance-authority"
import { AlertTriangle, CheckCircle } from "lucide-react"


const bannerVariants = cva(
  "border text-center p-4 text-sm flex items-center w-full rounded-md shadow-md",
  {
    variants: {
      variant: {
        warning: "bg-yellow-200/80 border-yellow-300 text-yellow-900 dark:bg-yellow-900/40 dark:border-yellow-800 dark:text-yellow-50",
        success:"bg-primary/80 border-primary text-white dark:bg-primary-900/40 dark:border-primary-800 dark:text-emerald-50",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  }
)

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircle,
}

interface BannerProps extends VariantProps<typeof bannerVariants> {
  label: string
}

export const Banner = ({variant, label} : BannerProps) => {
  const Icon = iconMap[variant || "warning"];
  return (
    <div className={cn(bannerVariants({variant}))}>
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </div>
  )
}
