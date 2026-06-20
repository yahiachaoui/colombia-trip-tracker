import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface State<T> {
  rows: T[]
  loading: boolean
  error: string | null
}

/**
 * Charge une table puis s'abonne aux changements en temps réel.
 * Tri par `created_at` ascendant par défaut.
 *
 * `version` : incrémente une dépendance externe pour forcer un rechargement
 * (utile après une mutation locale pour un retour immédiat).
 */
export function useRealtimeTable<T extends { id: string | number }>(
  table: string,
  orderBy: string = 'created_at',
): State<T> {
  const [rows, setRows] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    let cancelled = false

    async function load() {
      const { data, error } = await supabase!
        .from(table)
        .select('*')
        .order(orderBy, { ascending: true })
      if (cancelled) return
      if (error) {
        setError(error.message)
      } else {
        setRows((data ?? []) as T[])
        setError(null)
      }
      setLoading(false)
    }

    load()

    const channel = supabase
      .channel(`realtime:${table}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        () => {
          // Rechargement complet : simple et robuste pour de petites tables.
          load()
        },
      )
      .subscribe()

    return () => {
      cancelled = true
      supabase!.removeChannel(channel)
    }
  }, [table, orderBy])

  return { rows, loading, error }
}
