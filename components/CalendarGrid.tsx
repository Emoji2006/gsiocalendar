"use client";
import { useEffect, useState } from "react";
import { CalendarEvent, User } from '@/lib/types';

export default function CalendarGrid({
  date,
  events,
  view,
  onViewChange,
  onEditEvent,
  onDayClick,
}: {
  date: Date;
  events: CalendarEvent[];
  view: 'month' | 'week';
  onViewChange: (view: 'month' | 'week') => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDayClick: (dateStr: string) => void;
}) {
  //const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [users] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('all');
  const [, setRefreshConster] = useState(0);


  useEffect(() => {
    //fetch("/api/events").then(res => res.json()).then(setEvents);
    //fetch("/api/users").then(res => res.json()).then(setUsers);

    let timeoutId: NodeJS.Timeout | undefined;
    
    const updateAtMidnight = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const timeUntilMidnight = tomorrow.getTime() - now.getTime();
      
      timeoutId = setTimeout(() => {
        setRefreshConster(prev => prev + 1);
        updateAtMidnight(); // Rappel récursif pour chaque jour
      }, timeUntilMidnight);
    };

    updateAtMidnight();

    // Fallback: mise à jour chaque minute au cas où
    const interval = setInterval(() => {
      setRefreshConster(prev => prev + 1);
    }, 60000);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, [date]);


  const filteredEvents = events.filter(e =>
    selectedUserId === 'all' || e.userId === Number(selectedUserId)
  );


  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const startDay = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getWeekDates = (d: Date) => {
    const start = new Date(d);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    return Array.from({ length: 7 }, (_, i) => {
      const current = new Date(start);
      current.setDate(start.getDate() + i);
      return current;
    });
  };
  const weekDays = view === 'week' ? getWeekDates(date) : [];

  const sortByUserLastName = (a: User, b: User) => {
    return a.lastName.localeCompare(b.lastName);
  };

  const sortByEventUserLastName = (a: CalendarEvent, b: CalendarEvent) => {
    const nameA = a.user?.lastName || "";
    const nameB = b.user?.lastName || "";
    return nameA.localeCompare(nameB);
  };

  const selectedUserColor = users.find(u => u.id === Number(selectedUserId))?.color

  return (
    <div>
      <div className="flex gap-2 mb-4 items-center">
        <div className="flex gap-2">
          <button onClick={() => onViewChange('month')} className={`px-4 py-1 rounded ${view === 'month' ? 'bg-blue-500 text-white' : ''}`}>Mois</button>
          <button onClick={() => onViewChange('week')} className={`px-4 py-1 rounded ${view === 'week' ? 'bg-blue-500 text-white' : ''}`}>Semaine</button>
        </div>
        <select className="border p-2 rounded" value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}
          style={{
            color: selectedUserId != 'all' ? selectedUserColor : undefined,
            borderWidth: "3px"
          }}>
          <option value="all">Tous les utilisateurs</option>
          {[...users].sort(sortByUserLastName).map(u =>
            <option
              key={u.id}
              value={u.id}
              style={{ color: u.color, fontWeight: 'bold' }}
            >
              {u.firstName} {u.lastName}
            </option>
          )}
        </select>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d, index) => {
          const todayDayIndex = new Date().getDay();
          const currentDayIndex = todayDayIndex === 0 ? 6 : todayDayIndex - 1;
          const isTodayColumn = index === currentDayIndex;
          return (
            <div key={d} className={`text-center font-bold p-2 bg-gray-100 border-b ${isTodayColumn ? 'text-red-600' : 'text-gray-800'}`}>
              {d}
            </div>
          );
        })}

        {view === 'month' ? (
          <>
            {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} className="h-32 bg-gray-50" />)}
            {days.map((day) => {
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              return <DayCell key={day} dateStr={dateStr} day={day} events={filteredEvents} onDayClick={onDayClick} onEditEvent={onEditEvent} sortByLastName={sortByEventUserLastName} />;
            })}
          </>
        ) : (
          weekDays.map((d, i) => {
            const dateStr = d.toISOString().split('T')[0];
            return <DayCell key={i} dateStr={dateStr} day={d.getDate()} events={filteredEvents} onDayClick={onDayClick} onEditEvent={onEditEvent} sortByLastName={sortByEventUserLastName} />;
          })
        )}
      </div>
    </div >
  );
}

function DayCell({ dateStr, day, events, onDayClick, onEditEvent, sortByLastName }: {
  dateStr: string;
  day: number;
  events: CalendarEvent[];
  onDayClick: (dateStr: string) => void;
  onEditEvent: (event: CalendarEvent) => void;
  sortByLastName: (a: CalendarEvent, b: CalendarEvent) => number;
}) {
  const isToday = dateStr === new Date().toISOString().split('T')[0];

  return (
    <div
      className="border h-auto w-auto p-1 flex flex-col hover:bg-gray-50 transition cursor-pointer"
      onClick={() => onDayClick(dateStr)}>
      <div className={`font-semibold text-xs mb-1 ${isToday ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
        {day}
      </div>

      <div className="grid grid-rows-2 h-full flex-1 space-y-0.5 overflow-x-auto">
        <div className="border-b border-dashed border-black-900 overflow-y-auto">
          {events.filter((e: CalendarEvent) => {
            const start = e.startDate.split('T')[0];
            const end = e.endDate.split('T')[0];
            return (
              (dateStr > start && dateStr < end) ||
              (dateStr === start && e.startPeriod === 'morning') ||
              (dateStr === end && e.endPeriod === 'morning')
            );
          })
            .sort(sortByLastName)
            .map((e: CalendarEvent) => (
              <div
                key={e.id}
                onClick={(ev) => { ev.stopPropagation(); onEditEvent(e); }}
                className="text-[14px] px-1 mb-0.5 rounded text-white w-full break-words leading-tight"
                style={{ backgroundColor: e.user?.color }}>
                {`${e.user?.firstName} ${e.user?.lastName} (M) -`}
                <span className="truncate opacity-90">
                  {` ${e.eventType?.label}`} </span>
              </div>
            ))}
        </div>
        <div className="overflow-y-auto">
          {events.filter((e: CalendarEvent) => {
            const start = e.startDate.split('T')[0];
            const end = e.endDate.split('T')[0];
            return (
              (dateStr > start && dateStr < end) ||
              (dateStr === start && e.startPeriod === 'afternoon') ||
              (dateStr === end && e.endPeriod === 'afternoon') ||
              (dateStr === start && dateStr === end && e.startPeriod === 'morning' && e.endPeriod === 'afternoon')
            );
          })
            .sort(sortByLastName)
            .map((e: CalendarEvent) => (
              <div
                key={e.id}
                onClick={(ev) => { ev.stopPropagation(); onEditEvent(e); }}
                className="text-[14px] px-1 mb-0.5 rounded text-white w-full break-words leading-tight"
                style={{ backgroundColor: e.user?.color }}>
                {`${e.user?.firstName} ${e.user?.lastName} (AP) -`}
                <span className="truncate opacity-90">
                  {` ${e.eventType?.label}`} </span>
              </div>
            ))}
        </div>
      </div>
    </div >
  );
}