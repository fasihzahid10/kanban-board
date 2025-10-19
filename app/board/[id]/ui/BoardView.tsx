'use client';

import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { useState } from 'react';

type Card = { id: string; title: string; description: string; order: number; dueDate?: string|null; columnId: string; };
type Column = { id: string; title: string; order: number; cards: Card[] };
type Board = { id: string; title: string; columns: Column[] };

function ColumnItem({column, onAddCard}:{column: Column; onAddCard:(colId:string, title:string)=>void}){
  const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id: column.id});
  const style = { transform: CSS.Transform.toString(transform), transition };
  const [title, setTitle] = useState("");

  async function rename(newTitle: string){
    await fetch(`/api/columns/${column.id}`, { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title: newTitle }) });
  }
  async function remove(){
    if(confirm('Delete column and its cards?')){
      await fetch(`/api/columns/${column.id}`, { method: 'DELETE' });
      location.reload();
    }
  }
  return (
    <div ref={setNodeRef} style={style} className="w-80 shrink-0 card p-3">
      <div className="flex items-center justify-between mb-2 cursor-grab" {...attributes} {...listeners}>
        <input defaultValue={column.title} onBlur={(e)=>rename(e.currentTarget.value)} className="font-semibold bg-transparent outline-none"/>
        <button className="text-sm text-red-600" onClick={remove}>Delete</button>
      </div>
      <SortableContext items={column.cards.map(c=>c.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {column.cards.map(card => <CardItem key={card.id} card={card} />)}
        </div>
      </SortableContext>
      <form className="mt-3 flex gap-2" onSubmit={async (e)=>{
        e.preventDefault();
        if(!title.trim()) return;
        await onAddCard(column.id, title.trim());
        setTitle("");
      }}>
        <input value={title} onChange={e=>setTitle(e.target.value)} className="input" placeholder="Add card..." />
        <button className="btn btn-primary" type="submit">Add</button>
      </form>
    </div>
  );
}

function CardItem({card}:{card: Card}){
  const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id: card.id});
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 };
  async function del(){
    if(confirm('Delete card?')){
      await fetch(`/api/cards/${card.id}`, { method: 'DELETE' });
      location.reload();
    }
  }
  return (
    <div ref={setNodeRef} style={style} className="rounded-xl border p-2 bg-white" {...attributes} {...listeners}>
      <div className="flex justify-between">
        <div className="font-medium">{card.title}</div>
        <button className="text-xs text-gray-500" onClick={del}>Delete</button>
      </div>
      {card.dueDate && <div className="text-xs text-gray-500 mt-1">Due: {new Date(card.dueDate).toLocaleDateString()}</div>}
      {card.description && <p className="text-sm text-gray-700 mt-1">{card.description}</p>}
      <details className="mt-1">
        <summary className="text-xs text-gray-600 cursor-pointer">Edit</summary>
        <CardEdit card={card} />
      </details>
    </div>
  );
}

function CardEdit({card}:{card: Card}){
  const [title, setTitle] = useState(card.title);
  const [desc, setDesc] = useState(card.description);
  const [due, setDue] = useState(card.dueDate ? card.dueDate.substring(0,10) : "");

  async function save(){
    await fetch(`/api/cards/${card.id}`, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ title, description: desc, dueDate: due || null })
    });
    location.reload();
  }
  return (
    <div className="mt-2 space-y-2">
      <input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title"/>
      <textarea className="input" value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description"/>
      <input type="date" className="input" value={due} onChange={e=>setDue(e.target.value)} />
      <button className="btn btn-primary" onClick={save}>Save</button>
    </div>
  );
}

export default function BoardView({ board }:{ board: Board }){
  const [columns, setColumns] = useState<Column[]>(board.columns);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  async function addColumn(title: string){
    await fetch(`/api/boards/${board.id}/columns`, { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title }) });
    location.reload();
  }
  async function addCard(columnId: string, title: string){
    await fetch(`/api/columns/${columnId}/cards`, { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title }) });
    location.reload();
  }

  function handleDragEnd(event: DragEndEvent){
    const {active, over} = event;
    if(!over) return;
    // Column reorder
    const colIds = columns.map(c=>c.id);
    if(colIds.includes(active.id as string) && colIds.includes(over.id as string)){
      if(active.id !== over.id){
        const oldIndex = colIds.indexOf(active.id as string);
        const newIndex = colIds.indexOf(over.id as string);
        const newCols = arrayMove(columns, oldIndex, newIndex).map((c, i)=>({...c, order: i}));
        setColumns(newCols);
        fetch(`/api/reorder/columns`, { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ boardId: board.id, order: newCols.map(c=>({id:c.id, order:c.order})) }) });
      }
      return;
    }
    // Card reorder within same column
    const allIds = new Set(columns.flatMap(c=>c.cards.map(cd=>cd.id)));
    if(allIds.has(active.id as string) && allIds.has(over.id as string)){
      const sourceCol = columns.find(c=>c.cards.find(cd=>cd.id===active.id));
      const targetCol = columns.find(c=>c.cards.find(cd=>cd.id===over.id));
      if(!sourceCol || !targetCol) return;
      const sourceIdx = sourceCol.cards.findIndex(cd=>cd.id===active.id);
      const targetIdx = targetCol.cards.findIndex(cd=>cd.id===over.id);
      if(sourceCol.id === targetCol.id){
        const newCards = arrayMove(sourceCol.cards, sourceIdx, targetIdx).map((cd,i)=>({...cd, order:i}));
        const newCols = columns.map(c=> c.id===sourceCol.id ? {...c, cards:newCards} : c);
        setColumns(newCols);
        fetch(`/api/reorder/cards`, { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ columnId: sourceCol.id, order: newCards.map(cd=>({id:cd.id, order:cd.order})) }) });
      }
    }
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{board.title}</h1>
        <AddColumn onAdd={addColumn} />
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={columns.map(c=>c.id)}>
          <div className="flex gap-4 overflow-auto pb-6">
            {columns.map(col => (
              <ColumnItem key={col.id} column={col} onAddCard={addCard} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function AddColumn({onAdd}:{onAdd:(title:string)=>void}){
  const [title, setTitle] = useState("");
  return (
    <form className="flex gap-2" onSubmit={(e)=>{e.preventDefault(); if(title.trim()){ onAdd(title.trim()); setTitle(""); }}}>
      <input className="input" placeholder="Add column..." value={title} onChange={e=>setTitle(e.target.value)} />
      <button className="btn btn-primary" type="submit">Add</button>
    </form>
  );
}
