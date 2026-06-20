import { useState } from 'react'
import type { Personne, Role } from '../lib/types'
import { ajouterPersonne } from '../data/personnes'
import { Sheet } from '../components/Sheet'

interface Props {
  personnes: Personne[]
  loading: boolean
  onSelect: (id: string) => void
}

export function SelectName({ personnes, loading, onSelect }: Props) {
  const [adding, setAdding] = useState(false)

  return (
    <div className="center-screen">
      <div className="brand">
        <div className="flag">🇨🇴</div>
        <h1>Voyage Colombie</h1>
        <p>Choisis ton nom pour commencer</p>
      </div>

      {loading ? (
        <p className="empty" style={{ textAlign: 'center' }}>
          Chargement…
        </p>
      ) : (
        <div className="name-grid">
          {personnes.map((p) => (
            <button key={p.id} className="name-btn" onClick={() => onSelect(p.id)}>
              <span>{p.nom}</span>
              {p.roles.includes('organisateur') && (
                <span className="badge">Organisateur</span>
              )}
            </button>
          ))}
          {personnes.length === 0 && (
            <p className="empty" style={{ textAlign: 'center' }}>
              Personne pour l'instant. Ajoute-toi 👇
            </p>
          )}
        </div>
      )}

      <button className="btn btn-ghost" onClick={() => setAdding(true)}>
        + Ajouter une personne
      </button>

      {adding && (
        <AddPersonSheet
          onClose={() => setAdding(false)}
          onCreated={() => setAdding(false)}
        />
      )}
    </div>
  )
}

function AddPersonSheet({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: () => void
}) {
  const [nom, setNom] = useState('')
  const [roles, setRoles] = useState<Role[]>(['voyageur'])
  const [saving, setSaving] = useState(false)

  function toggleRole(r: Role) {
    setRoles((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r],
    )
  }

  async function submit() {
    if (!nom.trim() || saving) return
    setSaving(true)
    try {
      // Au moins le rôle voyageur par défaut.
      await ajouterPersonne(nom, roles.length ? roles : ['voyageur'])
      onCreated()
    } catch (e) {
      alert('Erreur : ' + (e as Error).message)
      setSaving(false)
    }
  }

  return (
    <Sheet title="Ajouter une personne" onClose={onClose}>
      <div className="field">
        <label>Prénom</label>
        <input
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Ex. Yahia"
          autoFocus
        />
      </div>
      <div className="field">
        <label>Rôle(s)</label>
        <div className="seg">
          <button
            type="button"
            className={roles.includes('voyageur') ? 'active' : ''}
            onClick={() => toggleRole('voyageur')}
          >
            Voyageur
          </button>
          <button
            type="button"
            className={roles.includes('organisateur') ? 'active' : ''}
            onClick={() => toggleRole('organisateur')}
          >
            Organisateur
          </button>
        </div>
      </div>
      <button className="btn btn-primary" onClick={submit} disabled={saving}>
        {saving ? 'Enregistrement…' : 'Créer'}
      </button>
    </Sheet>
  )
}
