# KanbanFlow — React + Redux Toolkit + dnd-kit

A fully functional Kanban board built with React 18, Redux Toolkit, and dnd-kit.

---

## Features
- Drag and drop cards within columns and across columns
- Add, edit, delete tasks (title, description, priority, due date, tag)
- Add and delete columns
- Stats bar (total tasks, in progress, completed, columns)
- DragOverlay ghost card while dragging
- Auto-save to localStorage — data persists on refresh
- Dark theme UI

---

## Setup (3 steps)

### Step 1 — Scaffold a Vite React project
```bash
npm create vite@latest kanban-board -- --template react
cd kanban-board
```

### Step 2 — Install dependencies
```bash
npm install @reduxjs/toolkit react-redux @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities uuid
```

### Step 3 — Replace src/ with the provided files
Copy all files from this zip into your project, **overwriting** the default Vite files:

```
kanban-board/
  index.html               ← overwrite
  vite.config.js           ← overwrite
  package.json             ← overwrite
  src/
    main.jsx               ← overwrite
    App.jsx                ← overwrite
    index.css              ← overwrite
    store/
      index.js             ← NEW
      boardSlice.js        ← NEW
    components/
      Board.jsx            ← NEW
      Column.jsx           ← NEW
      TaskCard.jsx         ← NEW
      AddTaskModal.jsx     ← NEW
      EditTaskModal.jsx    ← NEW
```

### Step 4 — Run
```bash
npm run dev
```
Open http://localhost:5173

---

## Deploy to Vercel (free — put this on your resume!)
```bash
npm run build
npx vercel --prod
```

---

## File overview

| File | What it does |
|------|-------------|
| `src/store/boardSlice.js` | All Redux state — columns, tasks, add/edit/delete/move/reorder actions |
| `src/store/index.js` | Redux store setup + localStorage auto-persistence |
| `src/components/Board.jsx` | DndContext, drag logic, stats bar, add-column form |
| `src/components/Column.jsx` | SortableContext, droppable zone, column header |
| `src/components/TaskCard.jsx` | useSortable, priority badges, edit/delete |
| `src/components/AddTaskModal.jsx` | Modal form to create new tasks |
| `src/components/EditTaskModal.jsx` | Pre-filled modal to edit existing tasks |

---

## Key concepts used (for interviews)
- **Normalized Redux state** — tasks stored as flat object `{ id: task }`, columns hold only `taskIds[]`
- **Redux Toolkit createSlice** — clean reducers with Immer for immutable updates
- **dnd-kit SortableContext + useSortable** — drag within column
- **dnd-kit useDroppable** — drop onto empty columns
- **DragOverlay** — ghost card that follows the cursor during drag
- **localStorage persistence** — `preloadedState` + `store.subscribe`
