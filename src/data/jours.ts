import { supabase } from '../lib/supabase'
import { demoStore } from '../lib/demoStore'

export interface NouveauJour {
  date: string
  lieu: string
}

export async function ajouterJour(j: NouveauJour) {
  const row = { date: j.date, lieu: j.lieu.trim() }
  if (!supabase) return demoStore.insert('jours', row)
  const { error } = await supabase.from('jours').insert(row)
  if (error) throw error
}

export async function supprimerJour(id: string) {
  // En démo, le store gère la cascade ; côté Postgres, c'est la FK on delete cascade.
  if (!supabase) return demoStore.remove('jours', id)
  const { error } = await supabase.from('jours').delete().eq('id', id)
  if (error) throw error
}
