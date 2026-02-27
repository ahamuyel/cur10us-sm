import Announcements from "@/components/ui/Announcements"
import BigCalendar from "@/components/ui/BigCalendar"
import EventCalendar from "@/components/ui/EventCalendar"

const StudentPage = () => {
  return (
    <div className="p-3 sm:p-4 lg:p-6 flex flex-col gap-4 sm:gap-6">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">

        <section className="xl:col-span-8">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-3 sm:p-4 shadow-sm border border-zinc-200 dark:border-zinc-800">
            <h1 className="text-base sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5">
              Minha Agenda
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mb-3 sm:mb-4">
              Suas aulas e atividades da semana
            </p>
            <BigCalendar />
          </div>
        </section>

        <aside className="xl:col-span-4 flex flex-col gap-4 sm:gap-6">
          <EventCalendar />
          <Announcements />
        </aside>

      </div>
    </div>
  )
}

export default StudentPage
