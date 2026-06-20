import { useMemo, useState } from 'react'
import {
  iconeActivite,
  type Activite,
  type Jour,
} from '../lib/types'
import { formatDateCourt, formatJourLong } from '../lib/dates'
import { supprimerJour } from '../data/jours'
import { supprimerActivite } from '../data/activites'
import { AddActivitySheet } from '../components/AddActivitySheet'

interface Props {
  jours: Jour[]
  activites: Activite[]
}

export function Programme({ jours, activites }: Props) {
  const [ajoutLignePour, setAjoutLignePour] = useState<string | null>(null)

  // Regroupe les lignes par jour (déjà triées par created_at via le hook).
  const lignesParJour = useMemo(() => {
    const map = new Map<string, Activite[]>()
    for (const a of activites) {
      const arr = map.get(a.jour_id) ?? []
      arr.push(a)
      map.set(a.jour_id, arr)
    }
    return map
  }, [activites])

  if (jours.length === 0) {
    return <p className="empty">Aucun jour. Ajoute le premier 👇</p>
  }

  const premier = jours[0].date
  const dernier = jours[jours.length - 1].date
  const plage =
    jours.length > 1
      ? `${formatDateCourt(premier)} – ${formatDateCourt(dernier)}`
      : formatDateCourt(premier)

  return (
    <>
      <p className="summary-sub" style={{ marginBottom: 16 }}>
        <strong>
          {jours.length} jour{jours.length > 1 ? 's' : ''}
        </strong>{' '}
        · {plage}
      </p>

      {jours.map((jour) => {
        const lignes = lignesParJour.get(jour.id) ?? []
        return (
          <section className="section" key={jour.id}>
            <div className="day-head">
              <div>
                <div className="day-date">{formatJourLong(jour.date)}</div>
                {jour.lieu && <div className="day-lieu">{jour.lieu}</div>}
              </div>
              <button
                className="icon-del"
                onClick={() => {
                  if (confirm('Supprimer ce jour et ses lignes ?')) supprimerJour(jour.id)
                }}
                aria-label="Supprimer le jour"
              >
                ✕
              </button>
            </div>

            {lignes.length > 0 && (
              <div className="card">
                {lignes.map((a) => (
                  <div className="row" key={a.id}>
                    <span className="act-icon" aria-hidden>
                      {iconeActivite(a.type)}
                    </span>
                    <div className="row-main">
                      <div className="row-title">{a.texte}</div>
                      {a.lien && (
                        <div className="row-meta">
                          <a
                            className="row-link"
                            href={a.lien}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Lien ↗
                          </a>
                        </div>
                      )}
                    </div>
                    <button
                      className="icon-del"
                      onClick={() => {
                        if (confirm('Supprimer cette ligne ?')) supprimerActivite(a.id)
                      }}
                      aria-label="Supprimer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button className="btn-link" onClick={() => setAjoutLignePour(jour.id)}>
              + Ajouter une ligne
            </button>
          </section>
        )
      })}

      {ajoutLignePour && (
        <AddActivitySheet
          jourId={ajoutLignePour}
          onClose={() => setAjoutLignePour(null)}
        />
      )}
    </>
  )
}
