import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  columns: [
    { id: 'col-1', title: 'To Do',       color: '#6366f1', taskIds: ['t1', 't2', 't3'] },
    { id: 'col-2', title: 'In Progress',  color: '#f59e0b', taskIds: ['t4', 't5'] },
    { id: 'col-3', title: 'Review',       color: '#8b5cf6', taskIds: ['t6'] },
    { id: 'col-4', title: 'Done',         color: '#10b981', taskIds: ['t7'] },
  ],
  tasks: {
    t1: { id: 't1', title: 'Set up project structure', description: 'Initialise Vite + React + Redux', priority: 'high',   dueDate: '2025-04-10', tag: 'Setup' },
    t2: { id: 't2', title: 'Design Redux state shape',  description: 'Normalised tasks + columns',    priority: 'high',   dueDate: '2025-04-11', tag: 'Architecture' },
    t3: { id: 't3', title: 'Create colour system',      description: 'Define brand tokens in CSS',    priority: 'low',    dueDate: '',           tag: 'Design' },
    t4: { id: 't4', title: 'Build Column component',    description: 'SortableContext wrapper',       priority: 'high',   dueDate: '2025-04-12', tag: 'Frontend' },
    t5: { id: 't5', title: 'Build TaskCard component',  description: 'useSortable + drag handle',     priority: 'medium', dueDate: '2025-04-13', tag: 'Frontend' },
    t6: { id: 't6', title: 'Add TaskModal with form',   description: 'Title, priority, due date',     priority: 'medium', dueDate: '2025-04-14', tag: 'Frontend' },
    t7: { id: 't7', title: 'Wire localStorage persist', description: 'preloadedState + subscribe',   priority: 'low',    dueDate: '2025-04-15', tag: 'Feature' },
  }
}

function genId() {
  return 't' + Date.now() + Math.random().toString(36).slice(2, 6)
}

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    addTask(state, action) {
      const { columnId, title, description, priority, dueDate, tag } = action.payload
      const id = genId()
      state.tasks[id] = { id, title, description, priority, dueDate, tag }
      const col = state.columns.find(c => c.id === columnId)
      if (col) col.taskIds.push(id)
    },
    deleteTask(state, action) {
      const { taskId, columnId } = action.payload
      delete state.tasks[taskId]
      const col = state.columns.find(c => c.id === columnId)
      if (col) col.taskIds = col.taskIds.filter(id => id !== taskId)
    },
    editTask(state, action) {
      const { taskId, updates } = action.payload
      if (state.tasks[taskId]) Object.assign(state.tasks[taskId], updates)
    },
    moveTask(state, action) {
      const { taskId, fromColId, toColId, newIndex } = action.payload
      const from = state.columns.find(c => c.id === fromColId)
      const to   = state.columns.find(c => c.id === toColId)
      if (!from || !to) return
      from.taskIds = from.taskIds.filter(id => id !== taskId)
      const idx = Math.min(newIndex, to.taskIds.length)
      to.taskIds.splice(idx, 0, taskId)
    },
    reorderTask(state, action) {
      const { columnId, oldIndex, newIndex } = action.payload
      const col = state.columns.find(c => c.id === columnId)
      if (!col) return
      const [moved] = col.taskIds.splice(oldIndex, 1)
      col.taskIds.splice(newIndex, 0, moved)
    },
    addColumn(state, action) {
      const { title, color } = action.payload
      const id = 'col-' + Date.now()
      state.columns.push({ id, title, color: color || '#6366f1', taskIds: [] })
    },
    deleteColumn(state, action) {
      const { columnId } = action.payload
      const col = state.columns.find(c => c.id === columnId)
      if (col) col.taskIds.forEach(id => delete state.tasks[id])
      state.columns = state.columns.filter(c => c.id !== columnId)
    },
  }
})

export const { addTask, deleteTask, editTask, moveTask, reorderTask, addColumn, deleteColumn } = boardSlice.actions
export default boardSlice.reducer
