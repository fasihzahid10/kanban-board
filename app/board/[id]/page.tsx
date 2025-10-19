import { prisma } from '@/lib/prisma';
import BoardView from './ui/BoardView';
export default async function BoardPage({ params }:{ params:{ id:string }}){ const board = await prisma.board.findUnique({ where:{ id: params.id }, include:{ columns:{ orderBy:{ order:'asc' }, include:{ cards:{ orderBy:{ order:'asc' }}}}}}); if(!board) return <div className='container py-6'>Board not found.</div>; return <BoardView board={board as any} /> }
