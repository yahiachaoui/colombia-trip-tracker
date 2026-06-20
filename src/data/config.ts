import { supabase } from '../lib/supabase'
import { demoStore } from '../lib/demoStore'

export async function majLienTricount(lien: string | null) {
  const valeur = lien?.trim() || null
  if (!supabase) return demoStore.update('config', 1, { lien_tricount: valeur })
  const { error } = await supabase
    .from('config')
    .update({ lien_tricount: valeur })
    .eq('id', 1)
  if (error) throw error
}
