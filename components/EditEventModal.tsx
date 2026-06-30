"use client";
import { useState } from "react";
import { CalendarEvent, EventFormData, Period } from '@/lib/types';

export default function EditEventModal({ event, onClose, onRefresh }: { event: CalendarEvent; onClose: () => void; onRefresh: () => void }) {

  // Initialisation avec la date actuelle au format YYYY-MM-DD
  const [formData, setFormData] = useState<EventFormData>({
    userId: event.user?.id.toString() || '',
    eventTypeId: event.eventType?.id.toString() || '',
    startDate: event.startDate.split('T')[0],
    endDate: event.endDate ? event.endDate.split('T')[0] : event.startDate.split('T')[0],
    startPeriod: event.startPeriod as Period,
    endPeriod: event.endPeriod as Period
  });
  // FONCTION DE SUPPRESSION
  const handleDelete = async () => {
    if (!confirm("Voulez-vous vraiment supprimer cette absence ?")) return;

    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onRefresh(); // Recharge le calendrier
        onClose();   // Ferme la modale
      } else {
        alert("Erreur lors de la suppression.");
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  // FONCTION DE MISE À JOUR
  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: event.user?.id,
          eventTypeId: event.eventType?.id,
          startDate: formData.startDate,
          endDate: formData.endDate, // On suppose ici la fin = début pour une absence d'une journée
          startPeriod: formData.startPeriod,
          endPeriod: formData.endPeriod,
        }),
      });

      if (response.ok) {
        onRefresh();
        onClose();
      } else {
        alert("Erreur lors de la mise à jour.");
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Modifier l&apos;absence</h2>

        {/* Date et Période de début */}
        {/*<div className="grid grid-cols-2 gap-2 mb-2">*/}
        <div className="mt-1 flex flex-col gap-1">
          <label className="font-semibold text-gray-500 uppercase">Date de début</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
            className="border p-2"
          />

          <select
            value={formData.startPeriod}
            onChange={e => setFormData({ ...formData, startPeriod: e.target.value as "morning" | "afternoon" })}
            className="border p-2">
            <option value="morning">Matin</option>
            <option value="afternoon">Après-midi</option>
          </select>
        </div>

        {/* Date et Période de fin */}
        <div className="mt-1 flex flex-col gap-1">
          <label className="font-semibold text-gray-500 uppercase">Date de fin</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={e => setFormData({ ...formData, endDate: e.target.value })}
            className="border p-2"
          />
          <select
            value={formData.endPeriod}
            onChange={e => setFormData({ ...formData, endPeriod: e.target.value as "morning" | "afternoon" })}
            className="border p-2">
            <option value="morning">Matin</option>
            <option value="afternoon">Après-midi</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-4 w-full">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Supprimer
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded">
            Enregistrer
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Annuler
          </button>
        </div>
      </div>
    </div >
  );
}