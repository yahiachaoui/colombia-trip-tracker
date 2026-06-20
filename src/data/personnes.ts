import { supabase } from '../lib/supabase'
import type { Role } from '../lib/types'

export async function ajouterPersonne(nom: string, roles: Role[]) {
  if (!supabase) throw new Error('Supabase non configuré')
  const { error } = await supabase
    .from('personnes')
    .insert({ nom: nom.trim(), roles })
  if (error) throw error
}

export async function majRolesPersonne(id: string, roles: Role[]) {
  if (!supabase) throw new Error('Supabase non configuré')
  const { error } = await supabase.from('personnes').update({ roles }).eq('id', id)
  if (error) throw error
}
