import { supabase } from '../lib/supabase'
import type { TacheType } from '../lib/types'

export interface NouvelleTache {
  titre: string
  type: TacheType
  assigne_a: string | null
  echeance: string | null
  lien: string | null
}

export async function ajouterTache(t: NouvelleTache) {
  if (!supabase) throw new Error('Supabase non configuré')
  const { error } = await supabase.from('taches').insert({
    titre: t.titre.trim(),
    type: t.type,
    assigne_a: t.assigne_a,
    echeance: t.echeance || null,
    lien: t.lien?.trim() || null,
  })
  if (error) throw error
}

export async function basculerTacheFaite(id: string, fait: boolean) {
  if (!supabase) throw new Error('Supabase non configuré')
  const { error } = await supabase.from('taches').update({ fait }).eq('id', id)
  if (error) throw error
}

export async function supprimerTache(id: string) {
  if (!supabase) throw new Error('Supabase non configuré')
  const { error } = await supabase.from('taches').delete().eq('id', id)
  if (error) throw error
}
