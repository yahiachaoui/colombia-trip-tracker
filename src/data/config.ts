import { supabase } from '../lib/supabase'

export async function majLienTricount(lien: string | null) {
  if (!supabase) throw new Error('Supabase non configuré')
  const { error } = await supabase
    .from('config')
    .update({ lien_tricount: lien?.trim() || null })
    .eq('id', 1)
  if (error) throw error
}
