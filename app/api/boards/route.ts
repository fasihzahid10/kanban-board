import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function POST(req: Request){ const form = await req.formData(); const title = (form.get('title') as string || '').trim(); if(!title) return NextResponse.redirect('/', { status: 302 }); const board = await prisma.board.create({ data: { title } }); return NextResponse.redirect(new URL(`/board/${board.id}`, req.url), { status: 302 }); }
