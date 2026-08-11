import { syncUserToDB } from "@/lib/syncUserToDB";
import { LayoutContent } from "./LayoutContent";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await syncUserToDB();

  return (
    <LayoutContent>
      {children}
    </LayoutContent>
  );
}