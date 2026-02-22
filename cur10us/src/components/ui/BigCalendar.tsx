"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  momentLocalizer,
  View,
  Views,
  ToolbarProps,
} from "react-big-calendar";
import moment from "moment";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { calendarEvents } from "@/lib/data";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment/locale/pt-br";

moment.locale("pt-br");

const localizer = momentLocalizer(moment);

/* ---------- Evento compatível com a lib ---------- */
type CalendarEvent = {
  title?: string; // ✅ agora compatível
  start: Date;
  end: Date;
  type?: string;
  teacher?: string;
  room?: string;
};

/* ---------- Cores ---------- */
const EVENT_COLORS: Record<string, string> = {
  math: "#6366f1",
  physics: "#22c55e",
  chemistry: "#f97316",
  default: "#64748b",
};

/* ---------- Views ---------- */
const views = [
  { key: Views.WORK_WEEK, label: "Semana" },
  { key: Views.DAY, label: "Dia" },
];

/* ---------- Toolbar tipado corretamente ---------- */
const CalendarHeader: React.FC<ToolbarProps<CalendarEvent, object>> = ({
  date,
  view,
  onView,
  onNavigate,
}) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4 px-2">
      {/* Navegação */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate("PREV")}
          className="p-2 rounded-full hover:bg-zinc-100"
        >
          <ChevronLeft size={18} />
        </button>

        <h2 className="text-lg font-semibold capitalize">
          {moment(date).format("MMMM YYYY")}
        </h2>

        <button
          onClick={() => onNavigate("NEXT")}
          className="p-2 rounded-full hover:bg-zinc-100"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Controles */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigate("TODAY")}
          className="px-3 py-1.5 text-sm rounded-lg border hover:bg-zinc-50"
        >
          Hoje
        </button>

        <div className="flex bg-zinc-100 rounded-xl p-1">
          {views.map((v) => (
            <button
              key={v.key}
              onClick={() => onView(v.key)}
              className={`px-3 py-1.5 text-sm rounded-lg transition
                ${
                  view === v.key
                    ? "bg-white shadow text-indigo-600 font-medium"
                    : "text-zinc-500"
                }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ---------- Componente ---------- */
const BigCalendar = () => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);
  const [selectedEvent, setSelectedEvent] =
    useState<CalendarEvent | null>(null);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setView(Views.DAY);
    }
  }, []);

  const eventStyleGetter = (event: CalendarEvent) => {
    const bg = EVENT_COLORS[event.type || "default"];

    return {
      style: {
        backgroundColor: bg,
        borderRadius: "10px",
        border: "none",
        color: "#fff",
        fontSize: "0.75rem",
        padding: "4px 6px",
      },
    };
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <Calendar<CalendarEvent>
          localizer={localizer}
          events={calendarEvents as CalendarEvent[]}
          startAccessor="start"
          endAccessor="end"
          views={{ work_week: true, day: true }}
          view={view}
          onView={setView}
          min={new Date(2025, 0, 1, 7, 30)}
          max={new Date(2025, 0, 1, 17, 30)}
          formats={{
            timeGutterFormat: "HH:mm",
            eventTimeRangeFormat: ({ start, end }) =>
              `${moment(start).format("HH:mm")} – ${moment(end).format(
                "HH:mm"
              )}`,
          }}
          dayLayoutAlgorithm="no-overlap"
          scrollToTime={new Date(2025, 0, 1, 7, 30)}
          showMultiDayTimes
          eventPropGetter={eventStyleGetter}
          onSelectEvent={(event) => setSelectedEvent(event)}
          components={{ toolbar: CalendarHeader }}
          style={{ height: 600 }}
        />
      </div>

      {/* Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md">
            <h2 className="text-lg font-semibold">
              {selectedEvent.title}
            </h2>

            <p className="text-sm text-zinc-500 mb-4">
              {selectedEvent.teacher} • {selectedEvent.room}
            </p>

            <button
              onClick={() => setSelectedEvent(null)}
              className="mt-6 w-full rounded-xl bg-indigo-600 text-white py-2"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BigCalendar;
