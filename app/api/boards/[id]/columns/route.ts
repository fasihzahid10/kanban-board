import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function POST(req: Request, { params }:{ params:{ id:string }}){ const { title } = await req.json(); const count = await prisma.column.count({ where: { boardId: params.id } }); const col = await prisma.column.create({ data: { title, order: count, boardId: params.id } }); return NextResponse.json(col); }
