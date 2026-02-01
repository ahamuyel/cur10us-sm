"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import { calendarEvents } from "@/lib/data";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";

// Configura o moment para português (opcional, mas fica mais bonito)
import "moment/locale/pt-br";
moment.locale("pt-br");

const localizer = momentLocalizer(moment);

const BigCalendar = () => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        views={{
          work_week: true,
          day: true,
        }}
        view={view}
        onView={handleOnChangeView}
        // style={{ height: "100%", minHeight: "600px" }}
        // Horário visível: das 7h30 às 17h30
        min={new Date(2025, 0, 1, 7, 30)}
        max={new Date(2025, 0, 1, 17, 30)}
        // Formato do horário (ex: 08:00)
        formats={{
          timeGutterFormat: "HH:mm",
          eventTimeRangeFormat: ({ start, end }) =>
            `${moment(start).format("HH:mm")} – ${moment(end).format("HH:mm")}`,
        }}
        // messages={{
        //   work_week: "Work week",
        //   day: "day",
        //   today: "Hoje",
        //   previous: "Anterior",
        //   next: "Próximo",
        // }}
        // Deixa o calendário mais limpo e moderno
        dayLayoutAlgorithm="no-overlap"
        scrollToTime={new Date(2025, 0, 1, 7, 30)}
        showMultiDayTimes
      />
    </div>
  );
};

export default BigCalendar;