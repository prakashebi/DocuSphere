import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { useBoardStore } from '../store/boardStore'
import Navbar from '../components/layout/Navbar'
import BoardColumn from '../components/board/BoardColumn'
import AddColumnForm from '../components/board/AddColumnForm'
import CardModal from '../components/board/CardModal'
import Spinner from '../components/ui/Spinner'
import type { Card } from '../types'
import { entitiesApi } from '../api/entities'

export default function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>()
  const { workspaces, boards, columns, cards, loading, fetchBoardData, moveCard } = useBoardStore()

  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [boardTitle, setBoardTitle] = useState('')

  const board = boards.find((b) => b.id === boardId)
  const workspace = workspaces.find((w) => w.id === board?.metadata?.workspace_id)

  useEffect(() => {
    if (!boardId) return
    fetchBoardData(boardId)
    // Fetch board title if not in store
    if (!board) {
      entitiesApi.getById(boardId).then((e) => setBoardTitle(e.title))
    }
  }, [boardId, fetchBoardData])

  useEffect(() => {
    if (board) setBoardTitle(board.title)
  }, [board])

  const cardsForColumn = (columnId: string) =>
    cards
      .filter((c) => c.metadata?.column_id === columnId)
      .sort((a, b) => (a.metadata?.order ?? 0) - (b.metadata?.order ?? 0))

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return
    const { draggableId, destination } = result
    await moveCard(draggableId, destination.droppableId, destination.index)
  }

  // Keep selected card in sync after updates
  const currentCard = selectedCard
    ? (cards.find((c) => c.id === selectedCard.id) ?? selectedCard)
    : null

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Navbar
        breadcrumbs={[
          { label: 'Workspaces', href: '/' },
          ...(workspace ? [{ label: workspace.title, href: `/workspace/${workspace.id}` }] : []),
          { label: boardTitle },
        ]}
      />

      {loading && columns.length === 0 ? (
        <div className="flex flex-1 items-center justify-center bg-indigo-600">
          <Spinner size="lg" className="border-white border-t-transparent" />
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex flex-1 gap-4 overflow-x-auto bg-indigo-600 p-4 items-start">
            {columns.map((col) => (
              <BoardColumn
                key={col.id}
                column={col}
                cards={cardsForColumn(col.id)}
                boardId={boardId!}
                onCardClick={setSelectedCard}
              />
            ))}
            {boardId && <AddColumnForm boardId={boardId} />}
          </div>
        </DragDropContext>
      )}

      {currentCard && (
        <CardModal card={currentCard} onClose={() => setSelectedCard(null)} />
      )}
    </div>
  )
}
