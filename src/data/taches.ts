import { supabase } from '../lib/supabase'
import { demoStore } from '../lib/demoStore'
import type { TacheType } from '../lib/types'

export interface NouvelleTache {
  titre: string
  type: TacheType
  assigne_a: string | null
  echeance: string | null
  lien: string | null
}

export async function ajouterTache(t: NouvelleTache) {
  const row = {
    titre: t.titre.trim(),
    type: t.type,
    assigne_a: t.assigne_a,
    fait: false,
    echeance: t.echeance || null,
    lien: t.lien?.trim() || null,
  }
  if (!supabase) return demoStore.insert('taches', row)
  const { error } = await supabase.from('taches').insert(row)
  if (error) throw error
}

export async function basculerTacheFaite(id: string, fait: boolean) {
  if (!supabase) return demoStore.update('taches', id, { fait })
  const { error } = await supabase.from('taches').update({ fait }).eq('id', id)
  if (error) throw error
}

export async function supprimerTache(id: string) {
  if (!supabase) return demoStore.remove('taches', id)
  const { error } = await supabase.from('taches').delete().eq('id', id)
  if (error) throw error
}
