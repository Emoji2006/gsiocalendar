"use client";
import { useEffect, useState } from "react";
import { CalendarEvent } from "@/types";

export default function EventModal({
  date,
  onClose,
  onAdd
}: {
  date: string,
  onClose: () => void,
  onAdd: () => void
}) {
  const [users, setUsers] = useState<CalendarEvent[]>([]);
  const [types, setTypes] = useState<CalendarEvent[]>([]);

  const [formData, setFormData] = useState({
    userId: "",
    eventTypeId: "",
    startDate: date,
    endDate: date,
    startPeriod: 'morning',
    endPeriod: 'afternoon'
  });

  useEffect(() => {
    fetch("/api/users").then(res => res.json()).then(setUsers);
    fetch("/api/event-types").then(res => res.json()).then(setTypes);
  }, []);

  useEffect(() => {
    setFormData(prev => ({ ...prev, startDate: date, endDate: date }));
  }, [date]);

  const handleSubmit = async () => {
    if (!formData.userId || !formData.eventTypeId) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    onAdd();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Nouvelle Absence - {date}</h2>

        <div className="flex flex-col gap-4">
          {/* Sélection Utilisateur avec couleur */}
          <select
            value={formData.userId}
            onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
            className="border p-2 rounded w-full outline-none"
            // Bordure colorée selon l'utilisateur sélectionné
            style={{
              color: users.find(u => u.id == formData.userId)?.color,
              borderWidth: "2px"
            }}
          >
            <option value="">Sélectionner un utilisateur</option>
            {users.map((u: CalendarEvent) => (
              <option
                key={u.id}
                value={u.id}
                style={{ color: u.color, fontWeight: 'bold' }} // Couleur appliquée au texte
              >
                {u.firstName} {u.lastName}
              </option>
            ))}
          </select>

          <div className="mt-1 flex flex-col gap-1">
            {/* Saisie Date de début */}
            <div>
              <label className="font-semibold text-gray-500 uppercase">Date de début</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="border p-2 rounded w-full mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <select
              value={formData.startPeriod}
              onChange={e => setFormData({ ...formData, startPeriod: e.target.value })}
              className="w-full border p-2 mb-2">
              <option value="morning">Matin</option>
              <option value="afternoon">Après-midi</option>
            </select>


            {/* Saisie Date de fin */}
            <div>
              <label className="font-semibold text-gray-500 uppercase">Date de fin</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="border p-2 rounded w-full mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <select
              value={formData.endPeriod}
              onChange={e => setFormData({ ...formData, endPeriod: e.target.value })}
              className="border p-2 mb-2">
              <option value="morning">Matin</option>
              <option value="afternoon">Après-midi</option>
            </select>

            {/* Sélection Type */}
            <select
              value={formData.eventTypeId}
              onChange={(e) => setFormData({ ...formData, eventTypeId: e.target.value })}
              //className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none bg-white mb-2"
              className="border p-2 rounded w-full outline-none"
              // Bordure colorée selon l'utilisateur sélectionné
              style={{
                color: types.find(u => u.id == formData.eventTypeId)?.color,
                borderWidth: "2px"
              }}
            >
              <option value="">Type d'absence</option>
              {types.map((t: CalendarEvent) => (
                <option
                  key={t.id}
                  value={t.id}
                  style={{ color: t.color, fontWeight: 'bold' }} // Couleur appliquée au texte
                >
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-1">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Annuler</button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">Enregistrer</button>
          </div>
        </div>
      </div>
    </div >
  );
}