export type Role = 'voyageur' | 'organisateur'

export type TacheType = 'perso' | 'collective' | 'organisation'

export const CATEGORIES = [
  'Vols',
  'Logements',
  'Transport',
  'Activités',
  'Nourriture',
  'Autre',
] as const

export type Categorie = (typeof CATEGORIES)[number]

export interface Personne {
  id: string
  nom: string
  roles: Role[]
  created_at: string
}

export interface Tache {
  id: string
  titre: string
  type: TacheType
  assigne_a: string | null
  fait: boolean
  echeance: string | null
  lien: string | null
  created_at: string
}

export interface Depense {
  id: string
  libelle: string
  categorie: string
  responsable: string | null
  prix: number
  paye: boolean
  lien: string | null
  created_at: string
}

export interface Config {
  id: number
  lien_tricount: string | null
}
