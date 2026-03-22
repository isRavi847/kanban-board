import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useDispatch, useSelector } from 'react-redux'
import { moveTask, reorderTask, addColumn } from '../store/boardSlice.js'
import Column from './Column.jsx'

const COLUMN_COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ec4899']

export default function Board() {
  const dispatch = useDispatch()
  const { columns, tasks } = useSelector(s => s.board)

  const [activeId, setActiveId]       = useState(null)
  const [newColTitle, setNewColTitle] = useState('')
  const [showNewCol, setShowNewCol]   = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  function findColumnOfTask(taskId) {
    return columns.find(c => c.taskIds.includes(taskId))
  }

  function handleDragStart({ active }) {
    setActiveId(active.id)
  }

  function handleDragEnd({ active, over }) {
    setActiveId(null)
    if (!over || active.id === over.id) return

    const fromCol = findColumnOfTask(active.id)
    if (!fromCol) return

    // Dropped directly onto a column (empty column target)
    const toColByColId = columns.find(c => c.id === over.id)
    // Dropped onto another task
    const toColByTask  = findColumnOfTask(over.id)

    const toCol = toColByColId || toColByTask
    if (!toCol) return

    if (fromCol.id === toCol.id) {
      // Same column — reorder
      const oldIndex = fromCol.taskIds.indexOf(active.id)
      const newIndex = toColByColId
        ? toCol.taskIds.length           // dropped on empty-col droppable
        : fromCol.taskIds.indexOf(over.id)
      if (oldIndex !== newIndex) {
        dispatch(reorderTask({ columnId: fromCol.id, oldIndex, newIndex }))
      }
    } else {
      // Different column — move
      const newIndex = toColByTask
        ? toCol.taskIds.indexOf(over.id)
        : toCol.taskIds.length
      dispatch(moveTask({
        taskId: active.id,
        fromColId: fromCol.id,
        toColId: toCol.id,
        newIndex: Math.max(0, newIndex),
      }))
    }
  }

  function handleAddColumn(e) {
    e.preventDefault()
    if (!newColTitle.trim()) return
    const color = COLUMN_COLORS[columns.length % COLUMN_COLORS.length]
    dispatch(addColumn({ title: newColTitle.trim(), color }))
    setNewColTitle('')
    setShowNewCol(false)
  }

  const activeTask = activeId ? tasks[activeId] : null
  const activeCol  = activeTask ? columns.find(c => c.taskIds.includes(activeId)) : null

  const totalTasks = Object.keys(tasks).length
  const doneTasks  = columns.find(c => c.title === 'Done')?.taskIds.length ?? 0

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Sub-header */}
      <div style={{
        padding: '12px 2rem',
        borderBottom: '1px solid #1e2430',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { label: 'Total tasks', value: totalTasks },
            { label: 'In progress', value: columns.find(c=>c.title==='In Progress')?.taskIds.length ?? 0 },
            { label: 'Completed', value: doneTasks },
            { label: 'Columns', value: columns.length },
          ].map(({ label, value }) => (
            <div key={label}>
              <div style={{ fontSize: 11, color: '#475569' }}>{label}</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: '#f1f5f9' }}>{value}</div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowNewCol(v => !v)}
          style={{
            padding: '7px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600,
            background: showNewCol ? '#1e2430' : '#6366f1',
            color: showNewCol ? '#94a3b8' : '#fff',
            border: '1px solid ' + (showNewCol ? '#2d3748' : 'transparent'),
          }}
        >
          {showNewCol ? 'Cancel' : '+ New column'}
        </button>
      </div>

      {/* New column form */}
      {showNewCol && (
        <div style={{
          padding: '12px 2rem',
          borderBottom: '1px solid #1e2430',
          background: '#0d1018',
        }}>
          <form onSubmit={handleAddColumn} style={{ display: 'flex', gap: 8, maxWidth: 360 }}>
            <input
              placeholder="Column name"
              value={newColTitle}
              onChange={e => setNewColTitle(e.target.value)}
              autoFocus
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              style={{
                padding: '0 16px', background: '#6366f1', color: '#fff',
                borderRadius: 6, fontWeight: 600, fontSize: 13, flexShrink: 0,
              }}
            >
              Add
            </button>
          </form>
        </div>
      )}

      {/* Board columns */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div style={{
          flex: 1,
          display: 'flex',
          gap: '1.25rem',
          padding: '1.5rem 2rem',
          overflowX: 'auto',
          overflowY: 'hidden',
          alignItems: 'flex-start',
        }}>
          {columns.map(col => (
            <Column
              key={col.id}
              column={col}
              tasks={col.taskIds.map(id => tasks[id]).filter(Boolean)}
            />
          ))}
        </div>

        {/* Drag overlay — ghost card while dragging */}
        <DragOverlay>
          {activeTask && activeCol ? (
            <div style={{
              background: '#161b27',
              border: `1px solid ${activeCol.color}`,
              borderLeft: `3px solid ${activeCol.color}`,
              borderRadius: 8,
              padding: '12px 14px',
              width: 260,
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              opacity: 0.95,
            }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: '#e2e8f0' }}>{activeTask.title}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
