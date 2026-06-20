import { supabase } from '../lib/supabase'

export interface NouveauJour {
  date: string
  lieu: string
}

export async function ajouterJour(j: NouveauJour) {
  if (!supabase) throw new Error('Supabase non configuré')
  const { error } = await supabase
    .from('jours')
    .insert({ date: j.date, lieu: j.lieu.trim() })
  if (error) throw error
}

export async function supprimerJour(id: string) {
  if (!supabase) throw new Error('Supabase non configuré')
  // Les lignes (activites) sont supprimées en cascade côté Postgres.
  const { error } = await supabase.from('jours').delete().eq('id', id)
  if (error) throw error
}
