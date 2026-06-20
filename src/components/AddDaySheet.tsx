import { useState } from 'react'
import { ajouterJour } from '../data/jours'
import { Sheet } from './Sheet'

interface Props {
  onClose: () => void
}

export function AddDaySheet({ onClose }: Props) {
  const [date, setDate] = useState('')
  const [lieu, setLieu] = useState('')
  const [saving, setSaving] = useState(false)

  async function submit() {
    if (!date || saving) return
    setSaving(true)
    try {
      await ajouterJour({ date, lieu })
      onClose()
    } catch (e) {
      alert('Erreur : ' + (e as Error).message)
      setSaving(false)
    }
  }

  return (
    <Sheet title="Nouveau jour" onClose={onClose}>
      <div className="field">
        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} autoFocus />
      </div>
      <div className="field">
        <label>Ville / lieu</label>
        <input
          value={lieu}
          onChange={(e) => setLieu(e.target.value)}
          placeholder="Ex. Carthagène"
        />
      </div>
      <button className="btn btn-primary" onClick={submit} disabled={saving}>
        {saving ? 'Enregistrement…' : 'Ajouter le jour'}
      </button>
    </Sheet>
  )
}
