import { useState } from 'react'

/**
 * Bandeau affiché en mode démo (Supabase non configuré) : prévient que les
 * données sont locales et non partagées. Fermable.
 */
export function DemoBanner() {
  const [hidden, setHidden] = useState(false)
  if (hidden) return null
  return (
    <div className="demo-banner">
      <span>
        <strong>Mode démo</strong> — données d'exemple, locales et non partagées.
        Branche Supabase pour le vrai partage (voir README).
      </span>
      <button onClick={() => setHidden(true)} aria-label="Masquer">
        ✕
      </button>
    </div>
  )
}
