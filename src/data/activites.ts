import { supabase } from '../lib/supabase'
import type { ActiviteType } from '../lib/types'

export interface NouvelleActivite {
  jour_id: string
  type: ActiviteType
  texte: string
  lien: string | null
}

export async function ajouterActivite(a: NouvelleActivite) {
  if (!supabase) throw new Error('Supabase non configuré')
  const { error } = await supabase.from('activites').insert({
    jour_id: a.jour_id,
    type: a.type,
    texte: a.texte.trim(),
    lien: a.lien?.trim() || null,
  })
  if (error) throw error
}

export async function supprimerActivite(id: string) {
  if (!supabase) throw new Error('Supabase non configuré')
  const { error } = await supabase.from('activites').delete().eq('id', id)
  if (error) throw error
}
