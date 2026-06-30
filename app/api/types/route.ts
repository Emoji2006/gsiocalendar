import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const types = await prisma.eventType.findMany();
  // T6.2 : Récupération des compteurs par type pour l'utilisateur connecté
  const stats = await prisma.event.groupBy({
    by: ['eventTypeId'],
    where: { userId: 1 }, // ID utilisateur à dynamiser
    _count: true,
  });

  return NextResponse.json({ types, stats });
}