import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function POST(req: Request, { params }:{ params:{ id: string }}){ const form = await req.formData(); const method = form.get('_method'); if(method === 'delete'){ await prisma.board.delete({ where: { id: params.id } }); } return NextResponse.redirect(new URL(`/`, req.url), { status: 302 }); }
