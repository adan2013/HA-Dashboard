import { ChartData, getHistoryStats } from '../utils'

const generateChartData = (values: number[]): ChartData[] =>
  values.map((value, index) => ({
    id: index.toString(),
    name: index.toString(),
    value
  }))

type TestCase = [string, string, string, ChartData[], number]

const testCases: TestCase[] = [
  [
    '10',
    '30',
    '19',
    generateChartData([15.4404, 30.002, 25.715, 10, 12.1004]),
    0
  ],
  [
    '12.4',
    '47.9',
    '28.8',
    generateChartData([17.42, 47.87, 12.44, 38.12, 27.93]),
    1
  ],
  [
    '7.10',
    '55.99',
    '28.10',
    generateChartData([52.4, 55.990007, 7.10007, 15.0000001, 10]),
    2
  ]
]

describe('chartUtils', () => {
  it.each(testCases)(
    'should return correct values: min %s, max %s, avg $s',
    (minResult, maxResult, avgResult, data, toFixed) => {
      expect(getHistoryStats(data, toFixed)).toEqual({
        min: minResult,
        max: maxResult,
        avg: avgResult
      })
    }
  )
})
