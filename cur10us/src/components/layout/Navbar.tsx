import Image from "next/image"

const NavBar = () =>{
    return (
        <div className="flex items-center justify-between p-4">
            {/* Search bar */}
            <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
                <Image src="/search.png" width={14} height={14} alt=""/>
                <input type="text" placeholder="Search..." name="" id="" className="w-[200px] p-2 bg-transparent outline-none"/>
            </div>
            {/* Icons & User */}
            <div className="flex items-center gap-6 justify-end w-full">
                <div className="bg-white rounded-full flex items-center justify-center cursor-pointer">
                    <Image src="/message.png" height={20} width={20} alt=""/>
                </div>
                <div className="bg-white rounded-full flex items-center justify-center cursor-pointer relative">
                    <Image src="/announcement.png" height={20} width={20} alt=""/>
                    <div className="absolute -top-3 -right-4 w-5 h-5 flex items-center justify-center bg-purple-500 rounded-full text-white text-xs">1</div>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs leading-3 font-medium">Kelcio Fragoso</span>
                    <span className="text-[10px] text-gray-500 text-right">Admin</span>
                </div>
                <Image src="/avatar.png" alt="" width={36} height={35} className="rounded-full"/>
            </div>
        </div>
    )
}

export default NavBar