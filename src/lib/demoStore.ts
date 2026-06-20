import { isSupabaseConfigured } from './supabase'

/** Mode démo : actif quand Supabase n'est pas configuré. */
export const isDemo = !isSupabaseConfigured

type Row = { id: string | number; created_at?: string } & Record<string, unknown>

// ---------------------------------------------------------------------------
// Données d'exemple (Colombie). Ids stables pour faciliter l'aperçu.
// ---------------------------------------------------------------------------
const J = '2026-08-12'

function seed(): Record<string, Row[]> {
  return {
    personnes: [
      { id: 'p-yahia', nom: 'Yahia', roles: ['voyageur', 'organisateur'], created_at: '2026-01-01T10:00:00Z' },
      { id: 'p-camila', nom: 'Camila', roles: ['voyageur'], created_at: '2026-01-01T10:01:00Z' },
      { id: 'p-mateo', nom: 'Mateo', roles: ['voyageur', 'organisateur'], created_at: '2026-01-01T10:02:00Z' },
    ],
    taches: [
      { id: 't-1', titre: 'Vérifier la validité du passeport', type: 'perso', assigne_a: 'p-yahia', fait: false, echeance: '2026-07-01', lien: null, created_at: '2026-01-02T10:00:00Z' },
      { id: 't-2', titre: 'Acheter une carte SIM locale', type: 'perso', assigne_a: 'p-yahia', fait: true, echeance: null, lien: null, created_at: '2026-01-02T10:01:00Z' },
      { id: 't-3', titre: 'Souscrire une assurance voyage', type: 'collective', assigne_a: null, fait: false, echeance: '2026-07-15', lien: null, created_at: '2026-01-02T10:02:00Z' },
      { id: 't-4', titre: 'Télécharger les cartes hors-ligne', type: 'collective', assigne_a: null, fait: false, echeance: null, lien: null, created_at: '2026-01-02T10:03:00Z' },
      { id: 't-5', titre: 'Réserver le transfert aéroport', type: 'organisation', assigne_a: 'p-yahia', fait: false, echeance: '2026-07-20', lien: 'https://example.com', created_at: '2026-01-02T10:04:00Z' },
      { id: 't-6', titre: 'Confirmer le guide à Carthagène', type: 'organisation', assigne_a: 'p-mateo', fait: false, echeance: null, lien: null, created_at: '2026-01-02T10:05:00Z' },
    ],
    depenses: [
      { id: 'd-1', libelle: 'Vols Paris ↔ Bogotá', categorie: 'Vols', responsable: 'p-yahia', prix: 2580, paye: false, lien: 'https://example.com', created_at: '2026-01-03T10:00:00Z' },
      { id: 'd-2', libelle: 'Airbnb Carthagène (3 nuits)', categorie: 'Logements', responsable: 'p-yahia', prix: 420, paye: true, lien: null, created_at: '2026-01-03T10:01:00Z' },
      { id: 'd-3', libelle: 'Hôtel Medellín (2 nuits)', categorie: 'Logements', responsable: 'p-camila', prix: 240, paye: false, lien: null, created_at: '2026-01-03T10:02:00Z' },
      { id: 'd-4', libelle: 'Vol intérieur Bogotá → Medellín', categorie: 'Transport', responsable: 'p-mateo', prix: 180, paye: false, lien: null, created_at: '2026-01-03T10:03:00Z' },
      { id: 'd-5', libelle: 'Excursion Guatapé', categorie: 'Activités', responsable: 'p-camila', prix: 150, paye: false, lien: null, created_at: '2026-01-03T10:04:00Z' },
    ],
    config: [{ id: 1, lien_tricount: 'https://tricount.com/fr/exemple-colombie' }],
    jours: [
      { id: 'j-1', date: J, lieu: 'Bogotá', created_at: '2026-01-04T10:00:00Z' },
      { id: 'j-2', date: '2026-08-13', lieu: 'Medellín', created_at: '2026-01-04T10:01:00Z' },
      { id: 'j-3', date: '2026-08-15', lieu: 'Carthagène', created_at: '2026-01-04T10:02:00Z' },
    ],
    activites: [
      { id: 'a-1', jour_id: 'j-1', type: 'transport', texte: 'Arrivée aéroport El Dorado', lien: null, created_at: '2026-01-05T10:00:00Z' },
      { id: 'a-2', jour_id: 'j-1', type: 'visite', texte: 'Quartier La Candelaria à pied', lien: null, created_at: '2026-01-05T10:01:00Z' },
      { id: 'a-3', jour_id: 'j-1', type: 'repas', texte: 'Dîner ajiaco', lien: null, created_at: '2026-01-05T10:02:00Z' },
      { id: 'a-4', jour_id: 'j-2', type: 'transport', texte: 'Vol Bogotá → Medellín', lien: 'https://example.com', created_at: '2026-01-05T10:03:00Z' },
      { id: 'a-5', jour_id: 'j-2', type: 'visite', texte: 'Excursion El Peñol & Guatapé', lien: null, created_at: '2026-01-05T10:04:00Z' },
      { id: 'a-6', jour_id: 'j-3', type: 'logement', texte: 'Check-in Airbnb vieille ville', lien: null, created_at: '2026-01-05T10:05:00Z' },
      { id: 'a-7', jour_id: 'j-3', type: 'visite', texte: 'Coucher de soleil Café del Mar', lien: null, created_at: '2026-01-05T10:06:00Z' },
    ],
  }
}

const tables: Record<string, Row[]> = seed()
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((cb) => cb())
}

export const demoStore = {
  subscribe(cb: () => void): () => void {
    listeners.add(cb)
    return () => listeners.delete(cb)
  },

  getRows<T>(table: string, orderBy: string = 'created_at'): T[] {
    const rows = [...(tables[table] ?? [])]
    rows.sort((a, b) => {
      const av = a[orderBy] as string | number | undefined
      const bv = b[orderBy] as string | number | undefined
      if (av == null) return 1
      if (bv == null) return -1
      return av < bv ? -1 : av > bv ? 1 : 0
    })
    return rows as T[]
  },

  insert(table: string, row: Record<string, unknown>) {
    const list = (tables[table] ??= [])
    list.push({
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ...row,
    })
    emit()
  },

  update(table: string, id: string | number, patch: Record<string, unknown>) {
    const list = tables[table] ?? []
    const row = list.find((r) => r.id === id)
    if (row) Object.assign(row, patch)
    emit()
  },

  remove(table: string, id: string | number) {
    tables[table] = (tables[table] ?? []).filter((r) => r.id !== id)
    // Cascade : supprimer un jour retire ses lignes.
    if (table === 'jours') {
      tables.activites = (tables.activites ?? []).filter((a) => a.jour_id !== id)
    }
    emit()
  },
}
