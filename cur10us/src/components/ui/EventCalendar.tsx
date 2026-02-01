"use client"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from "lucide-react"
import 'react-calendar/dist/Calendar.css'

const CalendarDynamic = dynamic(() => import("react-calendar"), { ssr: false })

const EventCalendar = () => {
    const [date, setDate] = useState(new Date())
    const [mounted, setMounted] = useState(false)
    
    // Simulação de eventos (Podes substituir pela tua API)
    const [events, setEvents] = useState([
        { id: 1, title: "Reunião de Projeto", time: "10:00", date: new Date().toDateString() },
        { id: 2, title: "Ginásio", time: "18:30", date: new Date().toDateString() },
    ])

    useEffect(() => setMounted(true), [])

    // Correção: Agora a função lida com o valor do componente de forma segura
    const handleDateChange = (value) => {
        // O react-calendar pode retornar Date, Date[] ou null
        if (value instanceof Date) {
            setDate(value)
            console.log("Data selecionada:", value.toDateString())
        }
    }

    // Filtra os eventos baseados na data selecionada
    const filteredEvents = events.filter(event => event.date === date.toDateString())

    if (!mounted) return <div className="h-[400px] w-full animate-pulse bg-zinc-100 dark:bg-zinc-800 rounded-2xl" />

    return (
        <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
            {/* CARD DO CALENDÁRIO */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border-none">
                <CalendarDynamic
                    onChange={handleDateChange}
                    value={date}
                    className="react-calendar-custom"
                    next2Label={null}
                    prev2Label={null}
                    nextLabel={<ChevronRight size={20} className="text-zinc-400 hover:text-indigo-500 transition-colors" />}
                    prevLabel={<ChevronLeft size={20} className="text-zinc-400 hover:text-indigo-500 transition-colors" />}
                    navigationLabel={({ date: labelDate }) => (
                        <div className="flex items-center gap-1 text-zinc-800 dark:text-zinc-100 font-bold text-lg px-2">
                            <span className="capitalize">
                                {labelDate.toLocaleString('pt-PT', { month: 'long' })}
                            </span>
                            <span className="text-zinc-400 font-medium">
                                {labelDate.getFullYear()}
                            </span>
                        </div>
                    )}
                    formatShortWeekday={(locale, date) =>
                        date.toLocaleDateString('pt-PT', { weekday: 'short' }).replace('.', '').substring(0, 3)
                    }
                    tileClassName={({ date: tileDate }) => {
                        const today = new Date()
                        const isToday = tileDate.toDateString() === today.toDateString()
                        const isSelected = tileDate.toDateString() === date.toDateString()
                        
                        return `
                            relative aspect-square flex items-center justify-center text-sm transition-all duration-200
                            ${isToday && !isSelected ? 'text-indigo-600 font-bold' : ''}
                            ${isSelected ? '!bg-indigo-600 !text-white rounded-full shadow-md scale-90' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full'}
                        `
                    }}
                />
            </div>

            {/* LISTA DE EVENTOS ABAIXO */}
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4 min-h-[150px]">
                <div className="flex items-center justify-between mb-4 text-zinc-800 dark:text-zinc-200">
                    <h3 className="font-bold flex items-center gap-2">
                        <CalendarIcon size={18} className="text-indigo-500" />
                        Eventos do Dia
                    </h3>
                    <span className="text-xs font-medium bg-white dark:bg-zinc-700 px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-600">
                        {date.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })}
                    </span>
                </div>

                {filteredEvents.length > 0 ? (
                    <div className="space-y-3">
                        {filteredEvents.map(event => (
                            <div key={event.id} className="bg-white dark:bg-zinc-800 p-3 rounded-xl border border-zinc-100 dark:border-zinc-700 flex items-center justify-between shadow-sm">
                                <span className="font-medium text-zinc-700 dark:text-zinc-300">{event.title}</span>
                                <div className="flex items-center gap-1 text-xs text-zinc-400">
                                    <Clock size={14} />
                                    {event.time}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-zinc-400 italic text-sm">
                        Nenhum evento para este dia.
                    </div>
                )}
            </div>

            <style jsx global>{`
                .react-calendar-custom {
                    border: none !important;
                    width: 100% !important;
                    background: transparent !important;
                }
                .react-calendar__navigation {
                    display: flex;
                    align-items: center;
                    margin-bottom: 1rem;
                }
                .react-calendar__navigation button {
                    background: none !important;
                    border: none !important;
                }
                .react-calendar__month-view__weekdays {
                    text-transform: uppercase;
                    font-weight: 700;
                    font-size: 0.65rem;
                    color: #a1a1aa;
                    margin-bottom: 0.5rem;
                }
                .react-calendar__month-view__weekdays__weekday abbr {
                    text-decoration: none !important;
                }
                .react-calendar__tile {
                    padding: 0.5rem !important;
                    background: none !important;
                    border: none !important;
                }
                .react-calendar__tile--active {
                    background: transparent !important;
                }
            `}</style>
        </div>
    )
}

export default EventCalendar