import { ChartData } from '../../charts/utils'

export type MinMaxValue = {
  min: string
  max: string
  avg: string
}

export const getHistoryStats = (
  data: ChartData[],
  toFixed = 0
): MinMaxValue => {
  if (!data || data.length === 0) {
    return null
  }
  const values = data.map(i => i.value).filter(i => i > 0)
  const min = Math.min(...values).toFixed(toFixed)
  const max = Math.max(...values).toFixed(toFixed)
  const sum = values.reduce((a, b) => a + b, 0)
  const avg = (sum / values.length).toFixed(toFixed)
  return {
    min,
    max,
    avg
  }
}
