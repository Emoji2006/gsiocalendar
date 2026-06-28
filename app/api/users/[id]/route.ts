import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

// Définition du type pour les paramètres (Next.js 16 - asynchrone)
type RouteContext = { params: Promise<{ id: string }> };

// DELETE: Supprimer un utilisateur
export async function DELETE(_req: Request, { params }: RouteContext) {
  try {
    const { id } = await params; // await obligatoire en Next.js 16

    // Optionnel : Vérifier si l'utilisateur a des événements avant de supprimer
    const eventCount = await prisma.event.count({
      where: { userId: Number(id) },
    });

    if (eventCount > 0) {
      return NextResponse.json(
        { error: "Impossible de supprimer : cet utilisateur a des absences enregistrées." },
        { status: 409 }
      );
    }

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'utilisateur." },
      { status: 500 }
    );
  }
}