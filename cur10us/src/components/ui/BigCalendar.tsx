"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Calendar,
  momentLocalizer,
  View,
  Views,
  ToolbarProps,
} from "react-big-calendar";
import moment from "moment";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { calendarEvents } from "@/lib/data";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "@/styles/big-calendar.css";
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
  physics: "#10B981",
  chemistry: "#F59E0B",
  biology: "#06B6D4",
  history: "#f43f5e",
  geography: "#8b5cf6",
  english: "#ec4899",
  literature: "#14b8a6",
  music: "#a855f7",
  art: "#f97316",
  default: "#64748b",
};

const SUBJECT_LABELS: Record<string, string> = {
  math: "Matemática",
  physics: "Física",
  chemistry: "Química",
  biology: "Biologia",
  history: "História",
  geography: "Geografia",
  english: "Inglês",
  literature: "Literatura",
  music: "Música",
  art: "Arte",
};

const views = [
  { key: Views.MONTH, label: "Mês" },
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
  const [hiddenSubjects, setHiddenSubjects] = useState<Set<string>>(new Set());

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

  const toggleSubject = (subject: string) => {
    setHiddenSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(subject)) {
        next.delete(subject);
      } else {
        next.add(subject);
      }
      return next;
    });
  };

  const filteredEvents = useMemo(
    () =>
      (calendarEvents as CalendarEvent[]).filter(
        (e) => !hiddenSubjects.has(e.type || "default")
      ),
    [hiddenSubjects]
  );

  const activeSubjects = useMemo(() => {
    const types = new Set<string>();
    for (const e of calendarEvents as CalendarEvent[]) {
      types.add(e.type || "default");
    }
    return Array.from(types).sort();
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
        boxShadow: `0 1px 3px ${bg}66`,
      },
    };
  };

  return (
    <>
      {/* Category filter pills */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {activeSubjects.map((subject) => {
          const color = EVENT_COLORS[subject] || EVENT_COLORS.default;
          const isHidden = hiddenSubjects.has(subject);
          return (
            <button
              key={subject}
              onClick={() => toggleSubject(subject)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition
                ${
                  isHidden
                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500"
                    : "text-white"
                }`}
              style={!isHidden ? { backgroundColor: color } : undefined}
            >
              {SUBJECT_LABELS[subject] || subject}
            </button>
          );
        })}
      </div>

      <div className="cur10us-calendar bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-2 sm:p-4 overflow-hidden">
        <Calendar<CalendarEvent>
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          views={{ month: true, work_week: true, day: true }}
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

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3 px-1">
        {activeSubjects.map((subject) => {
          const color = EVENT_COLORS[subject] || EVENT_COLORS.default;
          return (
            <div key={subject} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-zinc-600 dark:text-zinc-400">
                {SUBJECT_LABELS[subject] || subject}
              </span>
            </div>
          );
        })}
      </div>

      {/* Event Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-xl border border-zinc-200 dark:border-zinc-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {selectedEvent.title}
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {moment(selectedEvent.start).format("HH:mm")} – {moment(selectedEvent.end).format("HH:mm")}
                </p>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                <X size={18} className="text-zinc-400" />
              </button>
            </div>

            {selectedEvent.type && (
              <span
                className="inline-block mt-3 px-2.5 py-1 rounded-full text-xs font-medium text-white"
                style={{
                  backgroundColor: EVENT_COLORS[selectedEvent.type] || EVENT_COLORS.default,
                }}
              >
                {SUBJECT_LABELS[selectedEvent.type] || selectedEvent.type}
              </span>
            )}

            <div className="mt-4 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
              {selectedEvent.teacher && (
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 dark:text-zinc-500">Professor:</span>
                  <span className="font-medium">{selectedEvent.teacher}</span>
                </div>
              )}
              {selectedEvent.room && (
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 dark:text-zinc-500">Sala:</span>
                  <span className="font-medium">{selectedEvent.room}</span>
                </div>
              )}
            </div>

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
