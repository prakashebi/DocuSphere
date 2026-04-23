import { useState } from 'react'
import { Droppable } from '@hello-pangea/dnd'
import { Plus, X, Check } from 'lucide-react'
import BoardCard from './BoardCard'
import type { Card, Column } from '../../types'
import { useBoardStore } from '../../store/boardStore'

interface Props {
  column: Column
  cards: Card[]
  onCardClick: (card: Card) => void
  boardId: string
}

export default function BoardColumn({ column, cards, onCardClick, boardId }: Props) {
  const [addingCard, setAddingCard] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState('')
  const { createCard } = useBoardStore()

  const handleAddCard = async () => {
    const title = newCardTitle.trim()
    if (!title) return
    await createCard(column.id, boardId, title)
    setNewCardTitle('')
    setAddingCard(false)
  }

  return (
    <div className="flex w-72 flex-shrink-0 flex-col rounded-xl bg-slate-100 max-h-full">
      {/* Column header */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <h3 className="text-sm font-semibold text-gray-700">{column.title}</h3>
        <span className="text-xs text-gray-400 bg-gray-200 rounded px-1.5 py-0.5">{cards.length}</span>
      </div>

      {/* Cards list */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto px-2 pb-1 transition-colors
              ${snapshot.isDraggingOver ? 'bg-indigo-50' : ''}`}
            style={{ minHeight: 8 }}
          >
            {cards.map((card, i) => (
              <BoardCard key={card.id} card={card} index={i} onClick={() => onCardClick(card)} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Add card area */}
      <div className="px-2 pb-2">
        {addingCard ? (
          <div className="rounded-lg bg-white p-2 shadow-sm">
            <textarea
              autoFocus
              className="w-full resize-none rounded border border-gray-200 p-2 text-sm focus:border-indigo-400 focus:outline-none"
              placeholder="Enter card title..."
              rows={2}
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddCard() }
                if (e.key === 'Escape') { setAddingCard(false); setNewCardTitle('') }
              }}
            />
            <div className="mt-1.5 flex items-center gap-2">
              <button
                onClick={handleAddCard}
                className="flex items-center gap-1 rounded bg-indigo-600 px-2.5 py-1 text-xs text-white hover:bg-indigo-700"
              >
                <Check size={12} /> Add card
              </button>
              <button
                onClick={() => { setAddingCard(false); setNewCardTitle('') }}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAddingCard(true)}
            className="flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-gray-500 hover:bg-gray-200 hover:text-gray-700"
          >
            <Plus size={14} /> Add a card
          </button>
        )}
      </div>
    </div>
  )
}
