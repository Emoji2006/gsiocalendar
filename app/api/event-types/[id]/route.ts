import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

// DELETE: Supprime un type d'absence
export async function DELETE(_req: Request, { params }: RouteContext) {
  try {
    const { id } = await params; // await obligatoire en Next.js 16 [cite: 230]

    // Vérification optionnelle : vérifier si des événements utilisent ce type avant suppression
    // Cela permet d'éviter les erreurs de contrainte de clé étrangère en base de données
    const eventCount = await prisma.event.count({
      where: { eventTypeId: Number(id) },
    });

    if (eventCount > 0) {
      return NextResponse.json(
        { error: "Impossible de supprimer : ce type est utilisé par des événements." },
        { status: 409 }
      );
    }

    await prisma.eventType.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la suppression du type d'absence." },
      { status: 500 }
    );
  }
}