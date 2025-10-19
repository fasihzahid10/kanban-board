import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function PUT(req: Request, { params }:{ params:{ id:string }}){ const { title, description, dueDate } = await req.json(); const card = await prisma.card.update({ where: { id: params.id }, data: { title, description, dueDate: dueDate ? new Date(dueDate) : null } }); return NextResponse.json(card); }
export async function DELETE(_req: Request, { params }:{ params:{ id:string }}){ await prisma.comment.deleteMany({ where: { cardId: params.id } }); await prisma.card.delete({ where: { id: params.id } }); return NextResponse.json({ ok: true }); }
