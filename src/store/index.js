import { configureStore } from '@reduxjs/toolkit'
import boardReducer from './boardSlice.js'

const STORAGE_KEY = 'kanban_board_v1'

const preloadedState = (() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { board: JSON.parse(saved) } : undefined
  } catch { return undefined }
})()

export const store = configureStore({
  reducer: { board: boardReducer },
  preloadedState,
})

store.subscribe(() => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store.getState().board))
  } catch {}
})
