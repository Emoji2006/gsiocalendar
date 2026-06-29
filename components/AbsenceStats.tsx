// components/AbsenceStats.tsx
"use client";
import { useEffect, useState } from "react";
import { CalendarEvent } from "@/types";

export default function AbsenceStats() {
  const [data, setData] = useState<{ types: CalendarEvent[], stats: { eventTypeId: number, _count: number }[] }>({ types: [], stats: [] });

  useEffect(() => {
    // Appel d'une route API qui retourne les types et le groupement des événements
    fetch("/api/stats")
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {data.types.map((type: CalendarEvent) => {
        // T6.4 : Calcul dynamique du compteur via les données groupées de l'API
        const count = data.stats.find((s: { eventTypeId: number, _count: number }) => s.eventTypeId === type.id)?._count || 0;
        
        return (
          <div key={type.id} className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-500 uppercase">{type.label}</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{count} jours</p>
          </div>
        );
      })}
    </div>
  );
}