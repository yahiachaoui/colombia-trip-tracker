import { useMemo, useState } from 'react'
import { CATEGORIES, type Config, type Depense, type Personne } from '../lib/types'
import { ExpenseRow } from '../components/ExpenseRow'
import { Money, formatMoney } from '../components/Money'
import { majLienTricount } from '../data/config'

interface Props {
  personnes: Personne[]
  depenses: Depense[]
  config: Config | null
}

export function Budget({ personnes, depenses, config }: Props) {
  const [filtre, setFiltre] = useState<string | null>(null)

  const nomDe = useMemo(() => {
    const map = new Map(personnes.map((p) => [p.id, p.nom]))
    return (id: string | null) => (id ? map.get(id) ?? null : null)
  }, [personnes])

  const nbVoyageurs = personnes.filter((p) => p.roles.includes('voyageur')).length

  const totalGlobal = depenses.reduce((s, d) => s + Number(d.prix), 0)
  const visibles = filtre
    ? depenses.filter((d) => d.categorie === filtre)
    : depenses
  const totalFiltre = visibles.reduce((s, d) => s + Number(d.prix), 0)
  const parPersonne = nbVoyageurs > 0 ? totalGlobal / nbVoyageurs : 0

  return (
    <>
      <div className="summary">
        <div className="summary-label">Coût total du voyage</div>
        <div className="summary-total">
          <Money value={totalGlobal} />
        </div>
        <div className="summary-sub">
          {nbVoyageurs > 0 ? (
            <>
              ≈ <strong>{formatMoney(parPersonne)}</strong> par voyageur ({nbVoyageurs})
            </>
          ) : (
            'Ajoute des voyageurs pour estimer le coût par personne'
          )}
        </div>
      </div>

      <div className="chips">
        <button
          className={`chip ${filtre === null ? 'active' : ''}`}
          onClick={() => setFiltre(null)}
        >
          Toutes
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`chip ${filtre === c ? 'active' : ''}`}
            onClick={() => setFiltre(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {filtre && (
        <p className="summary-sub" style={{ marginBottom: 12 }}>
          Sous-total {filtre} : <strong>{formatMoney(totalFiltre)}</strong>
        </p>
      )}

      <section className="section">
        {visibles.length > 0 ? (
          <div className="card">
            {visibles.map((d) => (
              <ExpenseRow
                key={d.id}
                depense={d}
                responsableNom={nomDe(d.responsable)}
                showCategorie={!filtre}
                deletable
              />
            ))}
          </div>
        ) : (
          <p className="empty">Aucune dépense{filtre ? ` en « ${filtre} »` : ''}.</p>
        )}
      </section>

      <TricountButton config={config} />
    </>
  )
}

function TricountButton({ config }: { config: Config | null }) {
  const [editing, setEditing] = useState(false)
  const [url, setUrl] = useState(config?.lien_tricount ?? '')
  const lien = config?.lien_tricount

  async function save() {
    try {
      await majLienTricount(url || null)
      setEditing(false)
    } catch (e) {
      alert('Erreur : ' + (e as Error).message)
    }
  }

  if (lien && !editing) {
    return (
      <section className="section">
        <a className="btn btn-tricount" href={lien} target="_blank" rel="noreferrer">
          Régler les comptes sur Tricount →
        </a>
        <button className="btn-link" onClick={() => setEditing(true)}>
          Modifier le lien Tricount
        </button>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="field">
        <label>Lien du Tricount partagé</label>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://tricount.com/…"
          inputMode="url"
        />
      </div>
      <button className="btn btn-primary" onClick={save}>
        Enregistrer le lien
      </button>
      {lien && (
        <button className="btn-link" onClick={() => setEditing(false)}>
          Annuler
        </button>
      )}
    </section>
  )
}
