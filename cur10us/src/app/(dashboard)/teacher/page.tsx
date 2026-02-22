import Announcements from "@/components/ui/Announcements"
import BigCalendar from "@/components/ui/BigCalendar"
import EventCalendar from "@/components/ui/EventCalendar"

const TeacherPage = () =>{
    return (
        <div className="p-4 flex gap-4 flex-col xl:flex-row">
            <div className="w-full xl:w-2/3">
                <div className="h-full bg-white p-4 rounded-md">
                    <h1 className="text-xl font-semibold">Schedule</h1>
                    <BigCalendar />
                </div>
            </div>
            <div className="w-full xl:w-1/3 flex flex-col gap-8">
                <EventCalendar />
                <Announcements />
            </div>
        </div>
    )
}

export default TeacherPage