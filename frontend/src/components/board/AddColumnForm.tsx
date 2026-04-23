import { useState } from 'react'
import { Plus, X, Check } from 'lucide-react'
import { useBoardStore } from '../../store/boardStore'

interface Props {
  boardId: string
}

export default function AddColumnForm({ boardId }: Props) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const { createColumn } = useBoardStore()

  const handleSubmit = async () => {
    const t = title.trim()
    if (!t) return
    await createColumn(boardId, t)
    setTitle('')
    setOpen(false)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex h-10 w-72 flex-shrink-0 items-center gap-2 rounded-xl bg-white/20 px-3 text-sm text-white hover:bg-white/30"
      >
        <Plus size={16} /> Add another list
      </button>
    )
  }

  return (
    <div className="w-72 flex-shrink-0 rounded-xl bg-slate-100 p-2">
      <input
        autoFocus
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
        placeholder="Enter list title…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit()
          if (e.key === 'Escape') { setOpen(false); setTitle('') }
        }}
      />
      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={handleSubmit}
          className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs text-white hover:bg-indigo-700"
        >
          <Check size={12} /> Add list
        </button>
        <button
          onClick={() => { setOpen(false); setTitle('') }}
          className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  )
}
