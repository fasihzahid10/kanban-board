import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function PUT(req: Request){ const { columnId, order } = await req.json(); await prisma.$transaction(order.map((o:any)=> prisma.card.update({ where: { id:o.id }, data: { order:o.order } }))); return NextResponse.json({ ok: true }); }
