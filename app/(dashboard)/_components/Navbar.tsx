import { MobileSidebar } from "./MobileSidebar"
import { NavbarRoutes } from "./NavbarRoutes"

export const Navbar = () => {
  return (
    <div className='p-4 border-b h-full flex items-center bg-white dark:bg-[#09090B]'>
      {/* mobile toggle */}
      <MobileSidebar/>

      {/* sidebar toggle */}
      <NavbarRoutes/>
    </div>
  )
}
