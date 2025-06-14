"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import qs  from 'query-string';

const HomeSearchConatiner = () => {
  const [title, settitle] = useState("")
  const router = useRouter()


  const handleClick = () => {
    const href = qs.stringifyUrl({
      url: "/search",
      query: {
        title: title || ""
      }
    })
    router.push(href)
  }
  return (
<div className="w-full items-center justify-center hidden md:flex px-4">
  <div className="w-[60%] h-16 px-4 py-2 flex items-center rounded-full shadow-lg gap-3 bg-neutral-50 dark:bg-[#141416]">
    <input 
      placeholder="Search Jobs"
      type="text"
      onChange={(e) => settitle(e.target.value)}
      className="flex-1 text-lg font-sans bg-transparent outline-none border-none focus:ring-0 dark:text-white placeholder:text-muted-foreground"
    />
    <button 
      onClick={handleClick} disabled={!title}
      className="text-white bg-primary dark:bg-primary dark:text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition"
    >
      Search
    </button>
  </div>
</div>

  )
}

export default HomeSearchConatiner