import { useState } from 'react'
import type { Personne, TacheType } from '../lib/types'
import { ajouterTache } from '../data/taches'
import { Sheet } from './Sheet'

interface Props {
  moi: Personne
  personnes: Personne[]
  onClose: () => void
}

const TYPES: { value: TacheType; label: string }[] = [
  { value: 'perso', label: 'Perso' },
  { value: 'collective', label: 'Collective' },
  { value: 'organisation', label: 'Organisation' },
]

export function AddTaskSheet({ moi, personnes, onClose }: Props) {
  const [titre, setTitre] = useState('')
  const [type, setType] = useState<TacheType>('perso')
  const [assigneA, setAssigneA] = useState<string>(moi.id)
  const [echeance, setEcheance] = useState('')
  const [lien, setLien] = useState('')
  const [saving, setSaving] = useState(false)

  // Une tâche collective concerne tout le monde → pas d'assignation.
  const showAssign = type !== 'collective'

  async function submit() {
    if (!titre.trim() || saving) return
    setSaving(true)
    try {
      await ajouterTache({
        titre,
        type,
        assigne_a: showAssign ? assigneA || null : null,
        echeance: echeance || null,
        lien: lien || null,
      })
      onClose()
    } catch (e) {
      alert('Erreur : ' + (e as Error).message)
      setSaving(false)
    }
  }

  return (
    <Sheet title="Nouvelle tâche" onClose={onClose}>
      <div className="field">
        <label>Titre</label>
        <input
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          placeholder="Ex. Réserver le vol intérieur"
          autoFocus
        />
      </div>

      <div className="field">
        <label>Type</label>
        <div className="seg">
          {TYPES.map((t) => (
            <button
              key={t.value}
              className={type === t.value ? 'active' : ''}
              onClick={() => setType(t.value)}
              type="button"
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {showAssign && (
        <div className="field">
          <label>Assignée à</label>
          <select value={assigneA} onChange={(e) => setAssigneA(e.target.value)}>
            {personnes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nom}
                {p.id === moi.id ? ' (moi)' : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="field">
        <label>Échéance (optionnel)</label>
        <input
          type="date"
          value={echeance}
          onChange={(e) => setEcheance(e.target.value)}
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
