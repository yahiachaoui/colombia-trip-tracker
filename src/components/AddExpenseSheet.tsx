import { useState } from 'react'
import { CATEGORIES, type Personne } from '../lib/types'
import { ajouterDepense } from '../data/depenses'
import { Sheet } from './Sheet'

interface Props {
  moi: Personne
  personnes: Personne[]
  onClose: () => void
}

export function AddExpenseSheet({ moi, personnes, onClose }: Props) {
  const [libelle, setLibelle] = useState('')
  const [categorie, setCategorie] = useState<string>(CATEGORIES[0])
  const [responsable, setResponsable] = useState<string>(moi.id)
  const [prix, setPrix] = useState('')
  const [lien, setLien] = useState('')
  const [saving, setSaving] = useState(false)

  async function submit() {
    if (!libelle.trim() || saving) return
    setSaving(true)
    try {
      await ajouterDepense({
        libelle,
        categorie,
        responsable: responsable || null,
        prix: parseFloat(prix.replace(',', '.')) || 0,
        lien: lien || null,
      })
      onClose()
    } catch (e) {
      alert('Erreur : ' + (e as Error).message)
      setSaving(false)
    }
  }

  return (
    <Sheet title="Nouvelle dépense" onClose={onClose}>
      <div className="field">
        <label>Libellé</label>
        <input
          value={libelle}
          onChange={(e) => setLibelle(e.target.value)}
          placeholder="Ex. Airbnb Carthagène (3 nuits)"
          autoFocus
        />
      </div>

      <div className="field">
        <label>Catégorie</label>
        <select value={categorie} onChange={(e) => setCategorie(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Prix (€)</label>
        <input
          value={prix}
          onChange={(e) => setPrix(e.target.value)}
          placeholder="0"
          inputMode="decimal"
        />
      </div>

      <div className="field">
        <label>Responsable</label>
        <select value={responsable} onChange={(e) => setResponsable(e.target.value)}>
          {personnes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nom}
              {p.id === moi.id ? ' (moi)' : ''}
            </option>
          ))}
        </select>
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
