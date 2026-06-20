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

// ---- Phase 2 : programme jour par jour ----

export const ACTIVITE_TYPES = [
  { value: 'transport', label: 'Transport', icon: '✈️' },
  { value: 'logement', label: 'Logement', icon: '🏨' },
  { value: 'visite', label: 'Visite', icon: '📍' },
  { value: 'repas', label: 'Repas', icon: '🍽️' },
  { value: 'autre', label: 'Autre', icon: '•' },
] as const

export type ActiviteType = (typeof ACTIVITE_TYPES)[number]['value']

export function iconeActivite(type: ActiviteType): string {
  return ACTIVITE_TYPES.find((t) => t.value === type)?.icon ?? '•'
}

export interface Jour {
  id: string
  date: string
  lieu: string
  created_at: string
}

export interface Activite {
  id: string
  jour_id: string
  type: ActiviteType
  texte: string
  lien: string | null
  created_at: string
}
