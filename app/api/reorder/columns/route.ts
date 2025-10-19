import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function PUT(req: Request){ const { boardId, order } = await req.json(); await prisma.$transaction(order.map((o:any)=> prisma.column.update({ where: { id:o.id }, data: { order:o.order } }))); return NextResponse.json({ ok: true }); }
