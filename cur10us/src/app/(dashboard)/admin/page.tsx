import UserCard from "@/components/ui/UserCard"
import CountChart from "@/components/ui/CountChart"
import AttendanceChart from "@/components/ui/AttendanceChart"
import FinanceChart from "@/components/ui/FinanceChart"
import EventCalendar from "@/components/ui/EventCalendar"
import Announcements from "@/components/ui/Announcements"

const AdminPage = () => {
    return (
        <div className="p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* MAIN */}
            <main className="lg:col-span-8 flex flex-col gap-8">

                {/* KPIs */}
                <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    <UserCard type="students" />
                    <UserCard type="teachers" />
                    <UserCard type="parents" />
                    <UserCard type="staffs" />
                </section>


                {/* OPERATION */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-1">
                        <CountChart />
                    </div>

                    <div className="lg:col-span-2">
                        <AttendanceChart />
                    </div>

                </section>

                {/* FINANCE */}
                <section>
                    <FinanceChart /> 
                </section>

            </main>

            {/* ASIDE */}
            <aside className="lg:col-span-4 flex flex-col gap-6">
                <EventCalendar />
                <Announcements />
            </aside>

        </div>
    )
}

export default AdminPage
