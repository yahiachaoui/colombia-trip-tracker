import { useState } from 'react'
import { ACTIVITE_TYPES, type ActiviteType } from '../lib/types'
import { ajouterActivite } from '../data/activites'
import { Sheet } from './Sheet'

interface Props {
  jourId: string
  onClose: () => void
}

export function AddActivitySheet({ jourId, onClose }: Props) {
  const [type, setType] = useState<ActiviteType>('visite')
  const [texte, setTexte] = useState('')
  const [lien, setLien] = useState('')
  const [saving, setSaving] = useState(false)

  async function submit() {
    if (!texte.trim() || saving) return
    setSaving(true)
    try {
      await ajouterActivite({ jour_id: jourId, type, texte, lien: lien || null })
      onClose()
    } catch (e) {
      alert('Erreur : ' + (e as Error).message)
      setSaving(false)
    }
  }

  return (
    <Sheet title="Ajouter une ligne" onClose={onClose}>
      <div className="field">
        <label>Type</label>
        <div className="seg">
          {ACTIVITE_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              className={type === t.value ? 'active' : ''}
              onClick={() => setType(t.value)}
              title={t.label}
            >
              <span style={{ fontSize: 18 }}>{t.icon}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label>Texte</label>
        <input
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          placeholder="Ex. Vieille ville à pied"
          autoFocus
        />
      </div>

      <div className="field">
        <label>Lien (optionnel)</label>
        <input
          value={lien}
          onChange={(e) => setLien(e.target.value)}
          placeholder="https://…"
          inputMode="url"
        />
      </div>

      <button className="btn btn-primary" onClick={submit} disabled={saving}>
        {saving ? 'Enregistrement…' : 'Ajouter'}
      </button>
    </Sheet>
  )
}
