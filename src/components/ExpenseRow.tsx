import type { Depense } from '../lib/types'
import { basculerDepensePayee, supprimerDepense } from '../data/depenses'
import { Money } from './Money'

interface Props {
  depense: Depense
  responsableNom?: string | null
  /** Affiche la catégorie en méta (utile sur l'écran Budget). */
  showCategorie?: boolean
  /** Permet la suppression (écran Budget). */
  deletable?: boolean
}

export function ExpenseRow({
  depense,
  responsableNom,
  showCategorie,
  deletable,
}: Props) {
  return (
    <div className="row">
      <input
        type="checkbox"
        className="check"
        checked={depense.paye}
        onChange={(e) => basculerDepensePayee(depense.id, e.target.checked)}
        aria-label={`${depense.libelle} payé`}
      />
      <div className="row-main">
        <div className={`row-title ${depense.paye ? 'done' : ''}`}>
          {depense.libelle}
        </div>
        <div className="row-meta">
          {showCategorie && <span className="badge muted">{depense.categorie}</span>}
          {responsableNom && <span>{responsableNom}</span>}
          {!depense.paye ? <span>À payer</span> : <span>Payé ✓</span>}
          {depense.lien && (
            <a className="row-link" href={depense.lien} target="_blank" rel="noreferrer">
              Lien ↗
            </a>
          )}
        </div>
      </div>
      <div style={{ textAlign: 'right', flex: '0 0 auto' }}>
        <div style={{ fontWeight: 600, fontSize: 15 }}>
          <Money value={depense.prix} />
        </div>
        {deletable && (
          <button
            className="icon-del"
            onClick={() => {
              if (confirm('Supprimer cette dépense ?')) supprimerDepense(depense.id)
            }}
            aria-label="Supprimer"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
