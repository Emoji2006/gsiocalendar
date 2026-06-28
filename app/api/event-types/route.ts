import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const eventTypes = await prisma.eventType.findMany({
            orderBy: { label: 'asc' }
        });

        return NextResponse.json(eventTypes);
    } catch (error) {
        console.error("Erreur lors de la récupération des types d'absences", error)
        return NextResponse.json(
            { error: "Impossible de récupérer les types d'absences" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { label, color } = body;

        if (!label) {
            return NextResponse.json(
                { error: "Le champ 'label' est obligatoire" },
                { status: 400 }
            );
        }

        const newEventType = await prisma.eventType.create({
            data: {
                label: label,
                color: color
            }
        });
        return NextResponse.json(newEventType, { status: 201 });
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { error: "Erreur lors de la récupération des types d'absences" },
            { status: 500 }
        );
    }
}