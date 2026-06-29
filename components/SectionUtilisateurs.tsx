"use client";

import { useEffect, useState } from "react";
import UserModal from "./UserModal";
import { User } from '@/lib/types';

export default function SectionUtilisateurs() {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour récupérer les utilisateurs
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/users");

      if (!res.ok) throw new Error("Erreur lors de la récupération des utilisateurs");

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError("Impossible de charger les utilisateurs.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fonction pour supprimer un utilisateur
  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;

    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });

      if (!res.ok) throw new Error("Erreur lors de la suppression");

      // Rafraîchir la liste après suppression
      fetchUsers();
    } catch (err) {
      alert("Erreur lors de la suppression.");
      console.error(err);
    }
  };

  if (loading) return <div className="p-4 text-center">Chargement...</div>;

  return (
    <div className="p-4">
      {/* Bouton d'ajout */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-4 py-2 mb-6 rounded hover:bg-blue-700 transition"
      >
        + Ajouter un utilisateur
      </button>

      {/* Affichage des erreurs éventuelles */}
      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* Liste des utilisateurs */}
      <div className="grid gap-3">
        {users.length === 0 ? (
          <p className="text-gray-500">Aucun utilisateur trouvé.</p>
        ) : (
          users.map((user) => (
            <div key={user.id} className="flex justify-between items-center p-4 border rounded shadow-sm bg-white">
              <div className="flex items-center gap-4">
                {/* Pastille de couleur */}
                <div
                  className="w-6 h-6 rounded-full border border-gray-200"
                  style={{ backgroundColor: user.color }}
                />
                <span className="font-semibold text-gray-800">
                  {user.firstName} {user.lastName}
                </span>
              </div>

              <button
                onClick={() => handleDelete(user.id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium transition"
              >
                Supprimer
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modale d'ajout */}
      {showModal && (
        <UserModal
          onClose={() => setShowModal(false)}
          onAdd={fetchUsers}
        />
      )}
    </div>
  );
}