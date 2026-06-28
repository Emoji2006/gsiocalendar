"use client";
import { useState } from "react";
import SectionUtilisateurs from "@/components/SectionUtilisateurs";
import SectionTypesAbsences from "@/components/SectionTypesAbsences";

export default function SettingsPage() {
  const [tab, setTab] = useState<'users' | 'eventTypes'>('users');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Paramètres</h1>
      <div className="flex gap-4 border-b mb-6">
        <button
          onClick={() => setTab('users')}
          className={`pb-2 ${tab === 'users' ? 'border-b-2 border-blue-600' : ''}`}
        >
          Utilisateurs
        </button>
        <button
          onClick={() => setTab('eventTypes')}
          className={`pb-2 ${tab === 'eventTypes' ? 'border-b-2 border-blue-600' : ''}`}
        >
          Types d'absences
        </button>
      </div>
      {tab === 'users' ? <SectionUtilisateurs /> : <SectionTypesAbsences />}
    </div>
  );
}