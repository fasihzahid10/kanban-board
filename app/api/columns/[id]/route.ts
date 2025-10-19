import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function PUT(req: Request, { params }:{ params:{ id:string }}){ const { title } = await req.json(); const col = await prisma.column.update({ where: { id: params.id }, data: { title } }); return NextResponse.json(col); }
export async function DELETE(_req: Request, { params }:{ params:{ id:string }}){ await prisma.card.deleteMany({ where: { columnId: params.id } }); await prisma.column.delete({ where: { id: params.id } }); return NextResponse.json({ ok: true }); }
