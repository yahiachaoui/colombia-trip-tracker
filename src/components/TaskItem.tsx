import type { Tache } from '../lib/types'
import { basculerTacheFaite, supprimerTache } from '../data/taches'

interface Props {
  tache: Tache
  /** Nom à afficher en méta (ex. assigné pour une tâche collective). */
  assigneNom?: string | null
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export function TaskItem({ tache, assigneNom }: Props) {
  return (
    <div className="row">
      <input
        type="checkbox"
        className="check"
        checked={tache.fait}
        onChange={(e) => basculerTacheFaite(tache.id, e.target.checked)}
        aria-label={tache.titre}
      />
      <div className="row-main">
        <div className={`row-title ${tache.fait ? 'done' : ''}`}>{tache.titre}</div>
        {(tache.echeance || assigneNom || tache.lien) && (
          <div className="row-meta">
            {assigneNom && <span>{assigneNom}</span>}
            {tache.echeance && <span>⏱ {formatDate(tache.echeance)}</span>}
            {tache.lien && (
              <a
                className="row-link"
                href={tache.lien}
                target="_blank"
                rel="noreferrer"
              >
                Lien ↗
              </a>
            )}
          </div>
        )}
      </div>
      <button
        className="icon-del"
        onClick={() => {
          if (confirm('Supprimer cette tâche ?')) supprimerTache(tache.id)
        }}
        aria-label="Supprimer"
      >
        ✕
      </button>
    </div>
  )
}
