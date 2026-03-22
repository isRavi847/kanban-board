import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDispatch } from 'react-redux'
import { deleteColumn } from '../store/boardSlice.js'
import TaskCard from './TaskCard.jsx'
import AddTaskModal from './AddTaskModal.jsx'

export default function Column({ column, tasks }) {
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false)
  const [hovered, setHovered] = useState(false)

  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  return (
    <>
      <div style={{
        flex: '0 0 280px',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 'calc(100vh - 100px)',
      }}>
        {/* Column header */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 4px',
            marginBottom: 12,
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 10, height: 10, borderRadius: '50%',
              background: column.color, flexShrink: 0,
            }} />
            <span style={{ fontWeight: 600, fontSize: 14, color: '#cbd5e1' }}>
              {column.title}
            </span>
            <span style={{
              fontSize: 11, fontWeight: 600,
              background: '#1e2430', color: '#64748b',
              padding: '1px 7px', borderRadius: 999,
            }}>
              {tasks.length}
            </span>
          </div>

          {hovered && (
            <button
              onClick={() => dispatch(deleteColumn({ columnId: column.id }))}
              style={{ fontSize: 11, color: '#475569', padding: '2px 6px' }}
              title="Delete column"
            >
              ✕
            </button>
          )}
        </div>

        {/* Top accent bar */}
        <div style={{
          height: 3, borderRadius: '2px 2px 0 0',
          background: column.color,
          marginBottom: 0,
          opacity: 0.8,
        }} />

        {/* Task list */}
        <div
          ref={setNodeRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            background: isOver ? column.color + '11' : '#111827',
            border: `1px solid ${isOver ? column.color + '44' : '#1e2430'}`,
            borderTop: 'none',
            borderRadius: '0 0 8px 8px',
            padding: '10px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            minHeight: 80,
            transition: 'background 0.15s, border-color 0.15s',
          }}
        >
          <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                columnId={column.id}
                columnColor={column.color}
              />
            ))}
          </SortableContext>

          {tasks.length === 0 && (
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#2d3748', fontSize: 12, minHeight: 60,
            }}>
              Drop tasks here
            </div>
          )}
        </div>

        {/* Add task button */}
        <button
          onClick={() => setShowModal(true)}
          style={{
            marginTop: 8,
            padding: '8px 12px',
            background: 'transparent',
            border: '1px dashed #2d3748',
            borderRadius: 8,
            color: '#475569',
            fontSize: 13,
            textAlign: 'left',
            transition: 'all 0.15s',
            width: '100%',
          }}
          onMouseEnter={e => {
            e.target.style.borderColor = column.color
            e.target.style.color = column.color
          }}
          onMouseLeave={e => {
            e.target.style.borderColor = '#2d3748'
            e.target.style.color = '#475569'
          }}
        >
          + Add task
        </button>
      </div>

      {showModal && (
        <AddTaskModal columnId={column.id} onClose={() => setShowModal(false)} />
      )}
    </>
  )
}
