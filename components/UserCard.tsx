"use client";
i mport { User } from '@/lib/types';

type UserCardProps = User & { onRefresh: () => void };

export default function UserCard({ id, firstName, lastName, color, onRefresh }: UserCardProps) {
  const handleDelete = async () => {
    if (confirm(`Supprimer ${firstName} ${lastName} ?`)) {
      await fetch(`/api/users/${id}`, { method: "DELETE" }); // T2.4, T3.7
      onRefresh(); // T3.7
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
        <span className="font-medium">{firstName} {lastName}</span>
      </div>
      <button onClick={handleDelete} className="text-red-500 hover:text-red-700 text-sm">
        Supprimer
      </button>
    </div>
  );
}