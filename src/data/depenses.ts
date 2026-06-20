import { supabase } from '../lib/supabase'

export interface NouvelleDepense {
  libelle: string
  categorie: string
  responsable: string | null
  prix: number
  lien: string | null
}

export async function ajouterDepense(d: NouvelleDepense) {
  if (!supabase) throw new Error('Supabase non configuré')
  const { error } = await supabase.from('depenses').insert({
    libelle: d.libelle.trim(),
    categorie: d.categorie,
    responsable: d.responsable,
    prix: d.prix,
    lien: d.lien?.trim() || null,
  })
  if (error) throw error
}

export async function basculerDepensePayee(id: string, paye: boolean) {
  if (!supabase) throw new Error('Supabase non configuré')
  const { error } = await supabase.from('depenses').update({ paye }).eq('id', id)
  if (error) throw error
}

export async function supprimerDepense(id: string) {
  if (!supabase) throw new Error('Supabase non configuré')
  const { error } = await supabase.from('depenses').delete().eq('id', id)
  if (error) throw error
}
