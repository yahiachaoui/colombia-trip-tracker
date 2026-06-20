import { supabase } from '../lib/supabase'
import { demoStore } from '../lib/demoStore'
import type { Role } from '../lib/types'

export async function ajouterPersonne(nom: string, roles: Role[]) {
  if (!supabase) return demoStore.insert('personnes', { nom: nom.trim(), roles })
  const { error } = await supabase
    .from('personnes')
    .insert({ nom: nom.trim(), roles })
  if (error) throw error
}

export async function majRolesPersonne(id: string, roles: Role[]) {
  if (!supabase) return demoStore.update('personnes', id, { roles })
  const { error } = await supabase.from('personnes').update({ roles }).eq('id', id)
  if (error) throw error
}
