const fmt = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

const fmtCents = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatMoney(value: number, cents = false): string {
  return (cents ? fmtCents : fmt).format(value || 0)
}

export function Money({ value, cents }: { value: number; cents?: boolean }) {
  return <>{formatMoney(value, cents)}</>
}
