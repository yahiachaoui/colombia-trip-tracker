import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'colombia.identite'

/**
 * Mémorise localement l'id de la personne sélectionnée.
 * On ne stocke que l'id : le nom et les rôles à jour viennent toujours de la base.
 */
export function useIdentity() {
  const [personneId, setPersonneId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY)
    } catch {
      return null
    }
  })

  useEffect(() => {
    try {
      if (personneId) localStorage.setItem(STORAGE_KEY, personneId)
      else localStorage.removeItem(STORAGE_KEY)
    } catch {
      // localStorage indisponible (mode privé) : on continue en mémoire.
    }
  }, [personneId])

  const choisir = useCallback((id: string) => setPersonneId(id), [])
  const oublier = useCallback(() => setPersonneId(null), [])

  return { personneId, choisir, oublier }
}
