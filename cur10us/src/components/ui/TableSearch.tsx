"use client"
import { Search } from "lucide-react"

const TableSearch = () => {
    return (
        <div className="group w-full md:w-auto flex items-center gap-2 text-sm rounded-xl ring-[1.5px] ring-zinc-200 dark:ring-zinc-800 px-3 py-1 bg-white dark:bg-zinc-950 transition-all focus-within:ring-indigo-600 dark:focus-within:ring-indigo-500 shadow-sm">
            <Search 
                size={16} 
                className="text-zinc-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" 
            />
            <input 
                type="text" 
                placeholder="Pesquisar..." 
                className="w-full md:w-[200px] p-2 bg-transparent outline-none text-zinc-700 dark:text-zinc-200 placeholder:text-zinc-400" 
            />
        </div>
    )
}

export default TableSearch