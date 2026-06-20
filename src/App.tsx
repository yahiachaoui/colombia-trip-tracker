import { useState } from 'react'
import { isSupabaseConfigured } from './lib/supabase'
import type { Activite, Config, Depense, Jour, Personne, Tache } from './lib/types'
import { useIdentity } from './hooks/useIdentity'
import { useRealtimeTable } from './hooks/useRealtimeTable'
import { BottomNav, type Tab } from './components/BottomNav'
import { AddTaskSheet } from './components/AddTaskSheet'
import { AddExpenseSheet } from './components/AddExpenseSheet'
import { AddDaySheet } from './components/AddDaySheet'
import { SelectName } from './screens/SelectName'
import { MonEspace } from './screens/MonEspace'
import { Programme } from './screens/Programme'
import { Budget } from './screens/Budget'

const TITRES: Record<Tab, string> = {
  espace: 'Mon espace',
  programme: 'Programme',
  budget: 'Budget',
}

const LIBELLES_FAB: Record<Tab, string> = {
  espace: '+ Nouvelle tâche',
  programme: '+ Nouveau jour',
  budget: '+ Nouvelle dépense',
}

export default function App() {
  if (!isSupabaseConfigured) return <ConfigNotice />
  return <AppReady />
}

function AppReady() {
  const { personneId, choisir, oublier } = useIdentity()
  const [tab, setTab] = useState<Tab>('espace')
  const [adding, setAdding] = useState(false)

  const personnes = useRealtimeTable<Personne>('personnes')
  const taches = useRealtimeTable<Tache>('taches')
  const depenses = useRealtimeTable<Depense>('depenses')
  const config = useRealtimeTable<Config>('config', 'id')
  const jours = useRealtimeTable<Jour>('jours', 'date')
  const activites = useRealtimeTable<Activite>('activites')

  const moi = personnes.rows.find((p) => p.id === personneId) ?? null

  // Pas (encore) d'identité valide → écran de sélection du nom.
  if (!moi) {
    return (
      <SelectName
        personnes={personnes.rows}
        loading={personnes.loading}
        onSelect={choisir}
      />
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>{TITRES[tab]}</h1>
          <div className="subtitle">Voyage Colombie 🇨🇴</div>
        </div>
        <button className="identity-chip" onClick={oublier} title="Changer de nom">
          {moi.nom} ▾
        </button>
      </header>

      <main className="content">
        {tab === 'espace' && (
          <MonEspace
            moi={moi}
            personnes={personnes.rows}
            taches={taches.rows}
            depenses={depenses.rows}
          />
        )}
        {tab === 'programme' && (
          <Programme jours={jours.rows} activites={activites.rows} />
        )}
        {tab === 'budget' && (
          <Budget
            personnes={personnes.rows}
            depenses={depenses.rows}
            config={config.rows[0] ?? null}
          />
        )}
      </main>

      <div className="fab">
        <button className="btn btn-primary" onClick={() => setAdding(true)}>
          {LIBELLES_FAB[tab]}
        </button>
      </div>

      <BottomNav active={tab} onChange={setTab} />

      {adding && tab === 'espace' && (
        <AddTaskSheet
          moi={moi}
          personnes={personnes.rows}
          onClose={() => setAdding(false)}
        />
      )}
      {adding && tab === 'programme' && (
        <AddDaySheet onClose={() => setAdding(false)} />
      )}
      {adding && tab === 'budget' && (
        <AddExpenseSheet
          moi={moi}
          personnes={personnes.rows}
          onClose={() => setAdding(false)}
        />
      )}
    </div>
  )
}

function ConfigNotice() {
  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Voyage Colombie 🇨🇴</h1>
          <div className="subtitle">Configuration requise</div>
        </div>
      </header>
      <div className="notice">
        <p>
          La connexion à Supabase n'est pas configurée. Crée un fichier{' '}
          <code>.env.local</code> (en local) ou ajoute ces variables d'environnement
          sur Vercel/Netlify :
        </p>
        <p>
          <code>VITE_SUPABASE_URL</code>
          <br />
          <code>VITE_SUPABASE_ANON_KEY</code>
        </p>
        <p>
          Puis exécute <code>supabase/schema.sql</code> dans le SQL Editor de ton
          projet Supabase. Détails dans le <code>README.md</code>.
        </p>
      </div>
    </div>
  )
}
