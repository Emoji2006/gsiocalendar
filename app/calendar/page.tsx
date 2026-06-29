"use client";
import { useState, useEffect } from "react";
import CalendarGrid from "@/components/CalendarGrid";
import EventModal from "@/components/EventModal";
import EditEventModal from "@/components/EditEventModal";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const [events, setEvents] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [eventTypes, setEventTypes] = useState<any[]>([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [targetDate, setTargetDate] = useState<string>("");

  useEffect(() => {
    fetch("/api/events").then(res => res.json()).then(setEvents);
    fetch("/api/users").then(res => res.json()).then(setUsers);
    fetch("/api/event-types").then(res => res.json()).then(setEventTypes);
  }, []);

  // Navigation unifiée
  const changeDate = (direction: number) => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else {
      newDate.setDate(newDate.getDate() + (direction * 7));
    }
    setCurrentDate(newDate);
  };

  // Logique de filtrage Présents / Absents
  const formatDateKey = currentDate.toISOString().split('T')[0];
  const absentUserIds = events
    .filter(e => formatDateKey >= e.startDate.split('T')[0] && formatDateKey <= e.endDate.split('T')[0])
    .map(e => e.userId);

  const usersPresent = users.filter(u => !absentUserIds.includes(u.id));
  const usersAbsent = users.filter(u => absentUserIds.includes(u.id));

  return (
    <div className="p-2 md:p-5 w-full max-w-auto mx-auto">
      {/* Navigation */}
      <div className="flex justify-between items-center gap-1 mb-6">
        <button onClick={() => changeDate(-1)} className="text-[16px] px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200" style={{ borderWidth: "3px" }}>&lt; Précédent</button>
        <h2 className="text-xl font-bold capitalize w-40 text-center">
          {currentDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={() => changeDate(1)} className="text-[16px] px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200" style={{ borderWidth: "3px" }}>Suivant &gt;</button>
        <button
          onClick={() => {
            setTargetDate(new Date().toISOString().split('T')[0]);
            setShowAddModal(true);
          }}
          className="text-[16px] bg-blue-600 text-white px-3 py-2 rounded font-medium hover:bg-blue-700 transition"
        >
          + Nouvelle Absence
        </button>
      </div>

      <div className="overflow-x-auto">
        <CalendarGrid
          date={currentDate}
          onDateChange={setCurrentDate}
          view={view}
          onViewChange={setView}
          onEditEvent={(event: any) => { setSelectedEvent(event); setShowEditModal(true); }}
          onDayClick={(dateStr: string) => { setTargetDate(dateStr); setShowAddModal(true); }}
        />
      </div>
      {/* SECTION LÉGENDES ET ÉTAT ÉQUIPE */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg border" style={{ borderWidth: "3px" }}>

        {/* État des utilisateurs */}
        <div className="space-y-4">
          <div>
            <h3 className="text-[16px] text-sm font-bold text-red-500 mb-2">Absents aujourd'hui :</h3>
            <div className="flex flex-wrap gap-2">
              {usersAbsent.length > 0 ? usersAbsent.map((u: any) => (
                <span key={u.id} className="text-[16px] px-2 py-1 text-xs text-white rounded bg-red-100 text-red-800 border " style={{ backgroundColor: u.color }}>
                  {u.firstName} {u.lastName}
                </span>
              )) : <span className="text-[14px] text-xs text-gray-400 italic">Aucun absent</span>}
            </div>
          </div>
          <div>
            <h3 className="text-[16px] text-sm font-bold text-green-500 mb-2">Présents aujourd'hui :</h3>
            <div className="flex flex-wrap gap-2">
              {usersPresent.length > 0 ? usersPresent.map((u: any) => (
                <span key={u.id} className="px-2 py-1 text-xs text-white rounded bg-green-100 text-green-800 border" style={{ backgroundColor: u.color }}>
                  {u.firstName} {u.lastName}
                </span>
              )) : <span className="text-[14px] text-xs text-gray-400 italic">Tout le monde est absent</span>}
            </div>
          </div>
        </div>

        {/* Types d'absences */}
        <div>
          <h3 className="text-[16px] text-sm font-bold text-black-500 mb-2">Types d'absences :</h3>
          <div className="flex flex-wrap gap-2">
            {eventTypes.map((type: any) => (
              <span key={type.id} className="text-[16px] px-2 py-1 text-xs rounded border" style={{ borderColor: type.color, color: type.color }}>
                {type.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* MODALES */}
      {
        showAddModal && (
          <EventModal
            date={targetDate}
            onClose={() => setShowAddModal(false)}
            onAdd={() => window.location.reload()}
          />
        )
      }
      {
        showEditModal && selectedEvent && (
          <EditEventModal
            event={selectedEvent}
            onClose={() => setShowEditModal(false)}
            onRefresh={() => window.location.reload()}
          />
        )
      }
    </div >
  );
}