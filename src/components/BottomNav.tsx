export type Tab = 'espace' | 'budget'

interface Props {
  active: Tab
  onChange: (tab: Tab) => void
}

export function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="bottom-nav">
      <button
        className={`nav-btn ${active === 'espace' ? 'active' : ''}`}
        onClick={() => onChange('espace')}
      >
        <span className="nav-icon">✦</span>
        Mon espace
      </button>
      <button
        className={`nav-btn ${active === 'budget' ? 'active' : ''}`}
        onClick={() => onChange('budget')}
      >
        <span className="nav-icon">€</span>
        Budget
      </button>
    </nav>
  )
}
