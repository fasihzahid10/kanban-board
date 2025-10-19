import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function POST(req: Request, { params }:{ params:{ id:string }}){ const { text } = await req.json(); const c = await prisma.comment.create({ data: { text, cardId: params.id } }); return NextResponse.json(c); }
export async function GET(_req: Request, { params }:{ params:{ id:string }}){ const comments = await prisma.comment.findMany({ where: { cardId: params.id }, orderBy: { createdAt: 'asc' } }); return NextResponse.json(comments); }
