"use client";
import { useState } from "react";

export default function UserModal({ onClose, onAdd }: { onClose: () => void, onAdd: () => void }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", color: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" }
    });
    onAdd();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg">
        <h2 className="mb-4 text-lg font-bold">Nouvel utilisateur</h2>
        <input className="border p-2 w-full mb-2" placeholder="Prénom" onChange={e => setForm({ ...form, firstName: e.target.value })} required />
        <input className="border p-2 w-full mb-2" placeholder="Nom" onChange={e => setForm({ ...form, lastName: e.target.value })} required />
        <input type="color" className="w-full h-10 mb-4" placeholder="Types d'absence" onChange={e => setForm({ ...form, color: e.target.value })} />
        <div className="flex gap-2">
          <button type="button" onClick={onClose} className="bg-gray-200 p-2 rounded">Annuler</button>
          <button type="submit" className="bg-blue-600 text-white p-2 rounded">Enregistrer</button>
        </div>
      </form>
    </div>
  );
}