import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET : Récupération des événements (avec filtrage mensuel pour le calendrier)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month'); // Format attendu : "YYYY-MM"

    // Calcul des bornes du mois pour Prisma
    const where = month ? {
      startDate: {
        gte: new Date(`${month}-01T00:00:00Z`),
        lt: new Date(new Date(`${month}-01T00:00:00Z`).setMonth(new Date(`${month}-01T00:00:00Z`).getMonth() + 1))
      }
    } : {};

    const events = await prisma.event.findMany({
      where,
      include: {
        user: true,      // Requis pour afficher la couleur et le nom
        eventType: true  // Requis pour afficher le libellé de l'absence
      },
      orderBy: { startDate: 'asc' }
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Erreur API GET events:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération" }, { status: 500 });
  }
}

// POST : Création d'une nouvelle absence
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, eventTypeId, startDate, endDate, startPeriod, endPeriod } = body;

    // Validation basique
    if (!userId || !eventTypeId || !startDate || !endDate || !startPeriod || !endPeriod) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    const newEvent = await prisma.event.create({
      data: {
        userId: Number(userId),
        eventTypeId: Number(eventTypeId),
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : new Date(startDate),
        startPeriod: startPeriod || 'morning',
        endPeriod: endPeriod || 'afternoon',
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Erreur API POST events:", error);
    return NextResponse.json({ error: "Erreur lors de la création de l'absence" }, { status: 500 });
  }
}