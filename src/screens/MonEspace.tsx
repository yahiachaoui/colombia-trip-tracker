import { useMemo } from 'react'
import type { Depense, Personne, Tache } from '../lib/types'
import { TaskItem } from '../components/TaskItem'
import { ExpenseRow } from '../components/ExpenseRow'

interface Props {
  moi: Personne
  personnes: Personne[]
  taches: Tache[]
  depenses: Depense[]
}

export function MonEspace({ moi, personnes, taches, depenses }: Props) {
  const nomDe = useMemo(() => {
    const map = new Map(personnes.map((p) => [p.id, p.nom]))
    return (id: string | null) => (id ? map.get(id) ?? null : null)
  }, [personnes])

  const estOrganisateur = moi.roles.includes('organisateur')

  const perso = taches.filter((t) => t.type === 'perso' && t.assigne_a === moi.id)
  const collectives = taches.filter((t) => t.type === 'collective')
  const orga = taches.filter(
    (t) => t.type === 'organisation' && t.assigne_a === moi.id,
  )
  const mesDepenses = depenses.filter((d) => d.responsable === moi.id)

  return (
    <>
      <Section
        title="Mes tâches perso"
        count={perso.length}
        empty="Aucune tâche perso. Ajoute-en une 👇"
      >
        {perso.map((t) => (
          <TaskItem key={t.id} tache={t} />
        ))}
      </Section>

      <Section
        title="Tâches collectives"
        count={collectives.length}
        empty="Aucune tâche collective."
      >
        {collectives.map((t) => (
          <TaskItem key={t.id} tache={t} assigneNom={nomDe(t.assigne_a)} />
        ))}
      </Section>

      {estOrganisateur && (
        <Section
          title="Mes tâches d'organisation"
          count={orga.length}
          empty="Aucune tâche d'organisation."
        >
          {orga.map((t) => (
            <TaskItem key={t.id} tache={t} />
          ))}
        </Section>
      )}

      <Section
        title="À réserver / payer"
        count={mesDepenses.length}
        empty="Aucune dépense sous ta responsabilité."
      >
        {mesDepenses.map((d) => (
          <ExpenseRow key={d.id} depense={d} showCategorie />
        ))}
      </Section>
    </>
  )
}

function Section({
  title,
  count,
  empty,
  children,
}: {
  title: string
  count: number
  empty: string
  children: React.ReactNode
}) {
  return (
    <section className="section">
      <h2 className="section-title">{title}</h2>
      {count > 0 ? (
        <div className="card">{children}</div>
      ) : (
        <p className="empty">{empty}</p>
      )}
    </section>
  )
}
