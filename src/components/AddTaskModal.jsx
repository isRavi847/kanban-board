import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addTask } from '../store/boardSlice.js'

export default function AddTaskModal({ columnId, onClose }) {
  const dispatch = useDispatch()
  const [title, setTitle]           = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority]     = useState('medium')
  const [dueDate, setDueDate]       = useState('')
  const [tag, setTag]               = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    dispatch(addTask({ columnId, title: title.trim(), description: description.trim(), priority, dueDate, tag: tag.trim() }))
    onClose()
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#161b27',
          border: '1px solid #2d3748',
          borderRadius: 12,
          padding: '24px',
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#f1f5f9' }}>Add new task</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Title *</label>
            <input
              placeholder="Task title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Description</label>
            <textarea
              placeholder="Optional description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              style={{
                width: '100%', resize: 'none',
                fontFamily: 'inherit', fontSize: 14,
                background: '#1e2430', border: '1px solid #2d3748',
                borderRadius: 6, color: '#e2e8f0', padding: '8px 12px', outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value)}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Due date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Tag / Label</label>
            <input placeholder="e.g. Frontend, Bug, Feature" value={tag} onChange={e => setTag(e.target.value)} />
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button
              type="submit"
              style={{
                flex: 1, padding: '9px 0',
                background: '#6366f1', color: '#fff',
                borderRadius: 6, fontWeight: 600, fontSize: 14,
              }}
            >
              Add task
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1, padding: '9px 0',
                background: '#1e2430', color: '#94a3b8',
                borderRadius: 6, fontSize: 14,
                border: '1px solid #2d3748',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
