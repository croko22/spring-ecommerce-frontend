const PEN_FORMATTER = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

export function formatPenAmount(amount: number) {
  const safeAmount = Number.isFinite(amount) ? amount : 0
  return PEN_FORMATTER.format(safeAmount)
}
