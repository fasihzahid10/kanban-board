import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function POST(req: Request, { params }:{ params:{ id:string }}){ const { title } = await req.json(); const col = await prisma.column.findUnique({ where: { id: params.id } }); if(!col) return NextResponse.json({ error: 'Column not found' }, { status: 404 }); const count = await prisma.card.count({ where: { columnId: params.id } }); const card = await prisma.card.create({ data: { title, order: count, columnId: params.id, boardId: col.boardId } }); return NextResponse.json(card); }
