"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";
import  qs  from 'query-string';


export const DateFilter = () => {
    const data = [
    {value: "today", label: "Today"},
    {value: "yesterday", label: "Yesterday"},
    {value: "thisWeek", label: "This Week"},
    {value: "lastWeek", label: "Last Week"},
    {value: "thisMonth", label: "This Month"},
  ]

  const router = useRouter();
  const pathname = usePathname();

  const onChange = (value: string) => {
    const currentQueryParams = qs.parseUrl(
      window.location.href
    ).query;

    const updatedQueryParams = {
      ...currentQueryParams,
      createdAtFilter: value,
    };

    const url = qs.stringifyUrl({
      url: pathname,
      query: updatedQueryParams,
    },{
      skipNull: true,skipEmptyString: true
    });

    router.push(url);
  };
  return (
    <Select onValueChange={(selected) => onChange(selected)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Filter by Date" />
      </SelectTrigger>
      <SelectContent>
        {data.map((item) => (
          <SelectItem
            key={item.value}
            value={item.value}
          >
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
