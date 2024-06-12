export type ChartData = {
  id: string
  name: string
  value: number
}

export type ValueThreshold = {
  label: string
  value: number
  color: string
}

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
  if (values.length === 0) {
    return null
  }
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
