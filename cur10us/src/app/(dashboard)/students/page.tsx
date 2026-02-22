import Announcements from "@/components/ui/Announcements"
import BigCalendar from "@/components/ui/BigCalendar"

const StudentPage = () => {
  return (
    <div className="p-4 lg:p-6 grid grid-cols-1 xl:grid-cols-12 gap-6">
      
      <section className="xl:col-span-8 bg-white rounded-2xl p-4">
        <h1 className="text-xl font-semibold mb-4">
          Schedule
          <span className="block text-sm text-zinc-400">
            Martin Khrat
          </span>
        </h1>

        <BigCalendar />
      </section>

      <aside className="xl:col-span-4 flex flex-col gap-6">
        <Announcements />
      </aside>

    </div>
  )
}

export default StudentPage
