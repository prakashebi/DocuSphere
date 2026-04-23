import { Draggable } from '@hello-pangea/dnd'
import { MessageSquare, User } from 'lucide-react'
import type { Card } from '../../types'

interface Props {
  card: Card
  index: number
  onClick: () => void
}

export default function BoardCard({ card, index, onClick }: Props) {
  const commentCount = (card.metadata?.comments ?? []).length
  const assignee = card.metadata?.assignee_name as string | undefined

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`mb-2 rounded-lg bg-white p-3 shadow-sm cursor-pointer
            hover:shadow-md transition-shadow select-none
            ${snapshot.isDragging ? 'shadow-lg rotate-1 opacity-90' : ''}`}
        >
          <p className="text-sm font-medium text-gray-800 leading-snug">{card.title}</p>
          {card.description && (
            <p className="mt-1 text-xs text-gray-500 line-clamp-2">{card.description}</p>
          )}
          <div className="mt-2 flex items-center gap-3 text-gray-400">
            {commentCount > 0 && (
              <span className="flex items-center gap-1 text-xs">
                <MessageSquare size={12} />
                {commentCount}
              </span>
            )}
            {assignee && (
              <span className="flex items-center gap-1 text-xs">
                <User size={12} />
                {assignee}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  )
}
