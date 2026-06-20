/** Parse une date ISO "YYYY-MM-DD" en Date locale (sans décalage de fuseau). */
function parseISODate(iso: string): Date {
  return new Date(iso + 'T00:00:00')
}

/** Court : "12 août" — utilisé pour les échéances de tâches. */
export function formatDateCourt(iso: string): string {
  return parseISODate(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  })
}

/** Long : "mar. 12 août" — utilisé pour les en-têtes de jour du programme. */
export function formatJourLong(iso: string): string {
  return parseISODate(iso).toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  })
}
