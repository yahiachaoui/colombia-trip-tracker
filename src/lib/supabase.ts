import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/**
 * True quand les deux variables d'environnement Supabase sont présentes.
 * Permet d'afficher un message de configuration clair plutôt que de crasher.
 */
export const isSupabaseConfigured = Boolean(url && anonKey)

/**
 * Client Supabase singleton. `null` si la config est absente — l'UI le gère.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null
