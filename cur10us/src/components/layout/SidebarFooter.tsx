"use client"

const SidebarFooter = () => (
  <div className="px-3 py-2 border-t border-zinc-200 dark:border-zinc-800">
    {/* Desktop: full text */}
    <p className="hidden lg:block text-[10px] text-zinc-400 dark:text-zinc-500 text-center">
      Powered by <span className="font-semibold">Cur10usX</span>
    </p>
    {/* Compact: abbreviation */}
    <p className="lg:hidden text-[10px] text-zinc-400 dark:text-zinc-500 text-center font-semibold">
      CX
    </p>
  </div>
)

export default SidebarFooter
