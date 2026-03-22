import Board from './components/Board.jsx'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        padding: '0 2rem',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #1e2430',
        background: '#0d1018',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: '#fff'
          }}>K</div>
          <span style={{ fontWeight: 600, fontSize: 16, color: '#f1f5f9' }}>KanbanFlow</span>
        </div>
        <span style={{ fontSize: 12, color: '#64748b' }}>
          Data saved automatically
        </span>
      </header>
      <Board />
    </div>
  )
}
