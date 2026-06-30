import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Récupérer tous les utilisateurs
export async function GET() {
  try {
    console.log('test')
    const users = await prisma.user.findMany({
      select: { id: true, firstName: true, lastName: true, color: true },
      orderBy: { lastName: "asc" }
    });
    return NextResponse.json(users);
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des utilisateurs" },
      { status: 500 }
    );
  }
}

// POST: Créer un nouvel utilisateur
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, color } = body;

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "Prénom et nom requis" },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        firstName, lastName, color
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la création de l'utilisateur" },
      { status: 500 }
    );
  }
}