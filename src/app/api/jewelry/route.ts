// src/app/api/jewelry/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const jewelry = await prisma.jewelry.findMany();
    return NextResponse.json(jewelry, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch jewelry items' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { name, description, price } = await req.json();
  try {
    const newJewelry = await prisma.jewelry.create({
      data: { name, description, price },
    });
    return NextResponse.json(newJewelry, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create jewelry item' }, { status: 500 });
  }
}