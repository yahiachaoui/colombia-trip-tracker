import { supabase } from '../lib/supabase'
import { demoStore } from '../lib/demoStore'

export interface NouvelleDepense {
  libelle: string
  categorie: string
  responsable: string | null
  prix: number
  lien: string | null
}

export async function ajouterDepense(d: NouvelleDepense) {
  const row = {
    libelle: d.libelle.trim(),
    categorie: d.categorie,
    responsable: d.responsable,
    prix: d.prix,
    paye: false,
    lien: d.lien?.trim() || null,
  }
  if (!supabase) return demoStore.insert('depenses', row)
  const { error } = await supabase.from('depenses').insert(row)
  if (error) throw error
}

export async function basculerDepensePayee(id: string, paye: boolean) {
  if (!supabase) return demoStore.update('depenses', id, { paye })
  const { error } = await supabase.from('depenses').update({ paye }).eq('id', id)
  if (error) throw error
}

export async function supprimerDepense(id: string) {
  if (!supabase) return demoStore.remove('depenses', id)
  const { error } = await supabase.from('depenses').delete().eq('id', id)
  if (error) throw error
}
