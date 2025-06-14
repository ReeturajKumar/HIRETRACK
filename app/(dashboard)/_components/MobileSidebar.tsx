import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "./Sidebar"
import { Menu } from "lucide-react"


export const MobileSidebar = () => {
  return (
    <Sheet>
    <SheetTrigger asChild>
  <button aria-label="Open Menu">
    <Menu size={35} className="md:hidden pr-4 hover:opacity-75 transition" />
  </button>
</SheetTrigger>
    <SheetContent className="p-0" side="left">
      <Sidebar/>
    </SheetContent>
  </Sheet>
  )
}
