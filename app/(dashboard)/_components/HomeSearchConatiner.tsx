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
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-start">
      <input 
        placeholder="Search jobs or companies...."
        type="text"
        value={title}
        onChange={(e) => settitle(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        className="w-full sm:w-[380px] md:w-[450px] lg:w-[500px] bg-white dark:bg-neutral-900 border-0 rounded-md px-5 py-3.5 text-[14px] font-medium text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 outline-none transition-all shadow-inner"
      />
      <button 
        onClick={handleClick}
        className="w-full sm:w-auto bg-[#D9FC33] border-0 text-neutral-950 px-7 py-3.5 rounded-md font-bold text-[14px] flex items-center justify-center gap-1.5 transition-all hover:bg-[#c6e82a] active:scale-[0.98] hover:translate-y-[-1px] shadow-sm hover:shadow-md cursor-pointer"
      >
        Explore &rarr;
      </button>
    </div>
  )
}

export default HomeSearchConatiner