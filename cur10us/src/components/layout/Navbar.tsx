import {
  Search,
  MessageCircle,
  Megaphone,
} from "lucide-react"
import Image from "next/image"

const NavBar = () => {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
      
      {/* SEARCH */}
      <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-500 focus-within:border-indigo-500 transition">
        <Search size={14} />
        <input
          type="text"
          placeholder="Pesquisar..."
          className="w-[200px] bg-transparent outline-none text-sm placeholder:text-zinc-400"
        />
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-6 ml-auto">
        
        {/* Messages */}
        <button className="relative text-zinc-500 hover:text-indigo-600 transition">
          <MessageCircle size={20} />
        </button>

        {/* Announcements */}
        <button className="relative text-zinc-500 hover:text-indigo-600 transition">
          <Megaphone size={20} />
          <span className="absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-medium">
            1
          </span>
        </button>

        {/* USER INFO */}
        <div className="hidden sm:flex flex-col leading-tight text-right">
          <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-100">
            Kelcio Fragoso
          </span>
          <span className="text-[10px] text-zinc-500">
            Admin
          </span>
        </div>

        {/* AVATAR */}
        <Image
          src="/avatar.png"
          alt="User Avatar"
          width={36}
          height={36}
          className="rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
        />

      </div>
    </header>
  )
}

export default NavBar
