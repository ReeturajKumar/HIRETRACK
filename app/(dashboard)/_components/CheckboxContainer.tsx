"use client"

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface AppliedFilter {
  value: string;
  label: string;
  checked ?: boolean
}


interface CheckboxContainerProps {
  data: AppliedFilter[]
 onChange : (dataValue: string[]) => void

}

export const CheckboxContainer = ({ data, onChange : onChnage} : CheckboxContainerProps) => {

  const [filters, setfilters] = useState<AppliedFilter[]>(data);

  useEffect(() => {
    setfilters(data);
  }, [data]);

  const handleCheckedChange = (item: AppliedFilter) => {
    const updatedFilters = filters.map(filter => {
      if (filter.value === item.value) {
        return { ...filter, checked: !filter.checked };
      }
      return filter;
    });
    setfilters(updatedFilters);
    onChnage(updatedFilters.filter(item => item.checked).map(item => item.value));
  }
  return (
    <div className="flex w-full flex-col items-start justify-start gap-2">
      {
        filters.map(item => (
          <div key={item.value} className={cn("flex items-center gap-2", item.checked && "text-primary")}>
            <Checkbox checked={item.checked || false} onCheckedChange={() => handleCheckedChange(item)} className="dark:text-white" />
            {item.label}
          </div>
      ))}
    </div>
  )
}
