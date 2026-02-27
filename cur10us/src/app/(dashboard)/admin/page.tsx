import UserCard from "@/components/ui/UserCard"
import CountChart from "@/components/ui/CountChart"
import AttendanceChart from "@/components/ui/AttendanceChart"
import FinanceChart from "@/components/ui/FinanceChart"
import EventCalendar from "@/components/ui/EventCalendar"
import Announcements from "@/components/ui/Announcements"

const AdminPage = () => {
    return (
        <div className="p-3 sm:p-4 lg:p-6 flex flex-col gap-4 sm:gap-6">

            {/* KPIs — 2 cols mobile, 4 cols desktop */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <UserCard type="students" />
                <UserCard type="teachers" />
                <UserCard type="parents" />
                <UserCard type="staffs" />
            </section>

            {/* MAIN + ASIDE */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">

                {/* MAIN COLUMN */}
                <div className="xl:col-span-8 flex flex-col gap-4 sm:gap-6">

                    {/* CHARTS ROW — stack on mobile, side-by-side on lg */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div className="lg:col-span-1">
                            <CountChart />
                        </div>
                        <div className="lg:col-span-2">
                            <AttendanceChart />
                        </div>
                    </div>

                    {/* FINANCE */}
                    <FinanceChart />
                </div>

                {/* ASIDE COLUMN */}
                <aside className="xl:col-span-4 flex flex-col gap-4 sm:gap-6">
                    <EventCalendar />
                    <Announcements />
                </aside>
            </div>
        </div>
    )
}

export default AdminPage
