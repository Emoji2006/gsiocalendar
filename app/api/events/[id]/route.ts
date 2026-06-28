import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Définition du type pour les paramètres de la route (Next.js 16+)
type RouteContext = { params: Promise<{ id: string }> };

// PUT: Modifier un événement existant
export async function PUT(req: Request, { params }: RouteContext) {
  try {
    const { id } = await params; // await obligatoire en Next.js 16+
    const body = await req.json();

    const updatedEvent = await prisma.event.update({
      where: { id: Number(id) },
      data: {
        userId: Number(body.userId),
        eventTypeId: Number(body.eventTypeId),
        // Conversion explicite en objet Date pour Prisma
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        startPeriod: body.startPeriod,
        endPeriod: body.endPeriod,
        note: body.note,
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Erreur API PUT:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'événement" },
      { status: 500 }
    );
  }
}

// DELETE: Supprimer un événement
export async function DELETE(_req: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    await prisma.event.delete({
      where: { id: Number(id) }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur API DELETE:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'événement" },
      { status: 500 }
    );
  }
}