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

type CalendarEvent = {
  title?: string;
  start: Date;
  end: Date;
  type?: string;
  teacher?: string;
  room?: string;
};

const EVENT_COLORS: Record<string, string> = {
  math: "#6366f1",
  physics: "#22c55e",
  chemistry: "#f97316",
  default: "#64748b",
};

const views = [
  { key: Views.WORK_WEEK, label: "Semana" },
  { key: Views.DAY, label: "Dia" },
];

const CalendarHeader: React.FC<ToolbarProps<CalendarEvent, object>> = ({
  date,
  view,
  onView,
  onNavigate,
}) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4">
      {/* Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigate("PREV")}
          className="p-1.5 sm:p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
        >
          <ChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
        </button>

        <h2 className="text-sm sm:text-lg font-semibold capitalize text-zinc-900 dark:text-zinc-100">
          {moment(date).format("MMMM YYYY")}
        </h2>

        <button
          onClick={() => onNavigate("NEXT")}
          className="p-1.5 sm:p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
        >
          <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigate("TODAY")}
          className="px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition text-zinc-700 dark:text-zinc-300"
        >
          Hoje
        </button>

        <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-xl p-0.5 sm:p-1">
          {views.map((v) => (
            <button
              key={v.key}
              onClick={() => onView(v.key)}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm rounded-lg transition
                ${
                  view === v.key
                    ? "bg-white dark:bg-zinc-700 shadow text-indigo-600 dark:text-indigo-400 font-medium"
                    : "text-zinc-500 dark:text-zinc-400"
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

const BigCalendar = () => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [calendarHeight, setCalendarHeight] = useState(500);

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setView(Views.DAY);
        setCalendarHeight(400);
      } else if (width < 1024) {
        setCalendarHeight(500);
      } else {
        setCalendarHeight(600);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const eventStyleGetter = (event: CalendarEvent) => {
    const bg = EVENT_COLORS[event.type || "default"];
    return {
      style: {
        backgroundColor: bg,
        borderRadius: "8px",
        border: "none",
        color: "#fff",
        fontSize: "0.7rem",
        padding: "2px 4px",
      },
    };
  };

  return (
    <>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-2 sm:p-4 overflow-hidden">
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
              `${moment(start).format("HH:mm")} – ${moment(end).format("HH:mm")}`,
          }}
          dayLayoutAlgorithm="no-overlap"
          scrollToTime={new Date(2025, 0, 1, 7, 30)}
          showMultiDayTimes
          eventPropGetter={eventStyleGetter}
          onSelectEvent={(event) => setSelectedEvent(event)}
          components={{ toolbar: CalendarHeader }}
          style={{ height: calendarHeight }}
        />
      </div>

      {/* Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-xl border border-zinc-200 dark:border-zinc-800"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {selectedEvent.title}
            </h2>

            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {selectedEvent.teacher} {selectedEvent.room ? `• ${selectedEvent.room}` : ""}
            </p>

            <button
              onClick={() => setSelectedEvent(null)}
              className="mt-6 w-full rounded-xl bg-indigo-600 text-white py-2.5 font-medium hover:bg-indigo-700 transition active:scale-[0.98]"
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
