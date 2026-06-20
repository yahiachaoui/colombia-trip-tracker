import { supabase } from '../lib/supabase'
import { demoStore } from '../lib/demoStore'
import type { ActiviteType } from '../lib/types'

export interface NouvelleActivite {
  jour_id: string
  type: ActiviteType
  texte: string
  lien: string | null
}

export async function ajouterActivite(a: NouvelleActivite) {
  const row = {
    jour_id: a.jour_id,
    type: a.type,
    texte: a.texte.trim(),
    lien: a.lien?.trim() || null,
  }
  if (!supabase) return demoStore.insert('activites', row)
  const { error } = await supabase.from('activites').insert(row)
  if (error) throw error
}

export async function supprimerActivite(id: string) {
  if (!supabase) return demoStore.remove('activites', id)
  const { error } = await supabase.from('activites').delete().eq('id', id)
  if (error) throw error
}
