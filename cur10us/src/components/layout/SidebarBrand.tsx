"use client"

import Link from "next/link"
import Image from "next/image"
import { useSchoolBrand } from "@/provider/school-brand"

const SidebarBrand = () => {
  const { name, abbreviation, logo } = useSchoolBrand()

  return (
    <div className="p-4">
      <Link href="/" className="flex items-center justify-center lg:justify-start gap-2">
        {logo ? (
          <Image src={logo} alt="Logo" width={32} height={32} className="w-8 h-8 rounded-lg object-contain" />
        ) : null}
        {/* Desktop: full name */}
        <span className="font-bold text-zinc-900 dark:text-zinc-100 hidden lg:inline truncate max-w-[140px]" title={name}>
          {name === "Cur10usX" ? (
            <>Cur10us<span className="text-primary-600 dark:text-primary-400">X</span></>
          ) : (
            name
          )}
        </span>
        {/* Compact sidebar: abbreviation */}
        {!logo && (
          <span className="font-bold text-zinc-900 dark:text-zinc-100 lg:hidden">
            {abbreviation === "CX" ? (
              <>C<span className="text-primary-600 dark:text-primary-400">X</span></>
            ) : (
              abbreviation
            )}
          </span>
        )}
      </Link>
    </div>
  )
}

export default SidebarBrand
