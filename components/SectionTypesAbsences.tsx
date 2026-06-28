"use client";

import { useEffect, useState } from "react";
import { EventType } from '@/lib/types';

export default function SectionTypesAbsences() {
  const [types, setTypes] = useState<EventType[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [newColor, setNewColor] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // T4.1 : Chargement des données
  const fetchTypes = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/event-types");
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      setTypes(data);
    } catch {
      setError("Impossible de charger les types d'absences.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => {
      await fetchTypes();
    })();
  }, []);

  // T4.2 & T4.3 : Ajout avec gestion d'erreur
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/event-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newLabel, color: newColor }),
      });

      if (!res.ok) throw new Error("Erreur lors de la création");

      const newType = await res.json();
      setTypes([...types, newType]);
      setNewLabel("");
      setNewColor("");
    } catch {
      setError("Erreur lors de l'ajout du type.");
    }
  };

  // T4.4 : Suppression sécurisée
  const handleDelete = async (id: number) => {
    if (!confirm("Confirmer la suppression ?")) return;

    try {
      const res = await fetch(`/api/event-types/${id}`, { method: "DELETE" });

      if (res.status === 409) {
        throw new Error("Impossible de supprimer : ce type est lié à des événements.");
      }
      if (!res.ok) throw new Error("Impossible de supprimer ce type.");

      setTypes(types.filter((t) => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression.");
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Types d&alop;absences</h2>

      {/* T4.3 : Affichage des erreurs */}
      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 border border-red-200">{error}</div>}

      {/* T4.2 : Formulaire d'ajout */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Nouveau type"
          className="border p-1 w-1 rounded flex-grow"
          required
        />
        <input
          type="color"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          className="w-10 h-10 p-1 border rounded cursor-pointer"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ajouter
        </button>
      </form>

      {/* T4.1 & T4.4 : Liste */}
      <ul className="space-y-2">
        {types.map((type) => (
          <li
            key={type.id}
            className="flex justify-between items-center p-3 border rounded"
          >
            <div className="flex item-center gap-3">
              <span className="w-6 h-6 rounded-full border border-gray-200" style={{ backgroundColor: type.color }} />
              <span className="font-semibold">
                {type.label}
              </span>
            </div>
            <button
              onClick={() => handleDelete(type.id)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div >
  );
}