import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { deleteTask } from '../store/boardSlice.js'
import EditTaskModal from './EditTaskModal.jsx'

const PRIORITY = {
  high:   { bg: '#3b1111', text: '#f87171', dot: '#ef4444' },
  medium: { bg: '#2d2310', text: '#fbbf24', dot: '#f59e0b' },
  low:    { bg: '#0f2418', text: '#34d399', dot: '#10b981' },
}

export default function TaskCard({ task, columnId, columnColor }) {
  const dispatch = useDispatch()
  const [showEdit, setShowEdit] = useState(false)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  }

  const p = PRIORITY[task.priority] || PRIORITY.low

  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes}>
        <div
          {...listeners}
          style={{
            background: '#161b27',
            border: '1px solid #1e2a3a',
            borderLeft: `3px solid ${columnColor}`,
            borderRadius: 8,
            padding: '12px 14px',
            cursor: 'grab',
            userSelect: 'none',
          }}
        >
          {task.tag && (
            <span style={{
              display: 'inline-block', fontSize: 10, fontWeight: 600,
              padding: '2px 7px', borderRadius: 999,
              background: columnColor + '22', color: columnColor,
              marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em',
            }}>
              {task.tag}
            </span>
          )}

          <p style={{ fontSize: 14, fontWeight: 500, color: '#e2e8f0', lineHeight: 1.45, marginBottom: 4 }}>
            {task.title}
          </p>

          {task.description && (
            <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5, marginBottom: 10 }}>
              {task.description}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 11, padding: '2px 8px', borderRadius: 999,
                background: p.bg, color: p.text,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: p.dot }} />
                {task.priority}
              </span>
              {task.dueDate && (
                <span style={{ fontSize: 11, color: '#475569' }}>{task.dueDate}</span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 4 }}>
              <button
                onPointerDown={e => e.stopPropagation()}
                onClick={e => { e.stopPropagation(); setShowEdit(true) }}
                style={{
                  fontSize: 11, color: '#475569', padding: '3px 8px',
                  borderRadius: 4, border: '1px solid #1e2a3a',
                }}
              >Edit</button>
              <button
                onPointerDown={e => e.stopPropagation()}
                onClick={e => { e.stopPropagation(); dispatch(deleteTask({ taskId: task.id, columnId })) }}
                style={{
                  fontSize: 11, color: '#475569', padding: '3px 8px',
                  borderRadius: 4, border: '1px solid #1e2a3a',
                }}
              >Del</button>
            </div>
          </div>
        </div>
      </div>

      {showEdit && <EditTaskModal task={task} onClose={() => setShowEdit(false)} />}
    </>
  )
}
