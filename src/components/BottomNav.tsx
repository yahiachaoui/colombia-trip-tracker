export type Tab = 'espace' | 'programme' | 'budget'

interface Props {
  active: Tab
  onChange: (tab: Tab) => void
}

const TABS: { value: Tab; icon: string; label: string }[] = [
  { value: 'espace', icon: '✦', label: 'Mon espace' },
  { value: 'programme', icon: '🗺', label: 'Programme' },
  { value: 'budget', icon: '€', label: 'Budget' },
]

export function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="bottom-nav">
      {TABS.map((t) => (
        <button
          key={t.value}
          className={`nav-btn ${active === t.value ? 'active' : ''}`}
          onClick={() => onChange(t.value)}
        >
          <span className="nav-icon">{t.icon}</span>
          {t.label}
        </button>
      ))}
    </nav>
  )
}
