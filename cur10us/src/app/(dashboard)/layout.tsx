import Link from "next/link";
import Image from "next/image";
import Menu from "@/components/layout/Menu"
import NavBar from "@/components/layout/Navbar"

export default function DasboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
        {/* {children} */}
        {/* LEFT */}
        <div className="w-1/6 md:w-[8%]  lg:w-[18%] xl:w-[14%] p-4 bg-white">
          <Link href="/" className="flex items-center justify-content lg:justify-start gap-2">
            <Image src="/logo.png" width={32} height={32} alt="logo"/>
            <span className="hidden lg:block font-bold">Cur10uSchool</span>
          </Link>
          <Menu />
        </div>
        {/* RIGHT */}
        <div className="w-[89%] md:w-[92%] lg:w-[94%] xl:w-[92%] bg-[#f7f8fa] overflow-scroll">
          {/* Search bar */}
          <NavBar />
          {children}
        </div>
    </div>
  );
}