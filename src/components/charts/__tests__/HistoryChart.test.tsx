import { render, screen } from '@testing-library/react'
import HistoryChart from '../HistoryChart'
import { ChartData } from '../utils'

const testData: ChartData[] = [
  {
    id: '1',
    name: 'A',
    value: 10
  },
  {
    id: '2',
    name: 'B',
    value: 20
  },
  {
    id: '3',
    name: 'C',
    value: 30
  }
]

jest.mock('recharts', () => {
  const originalModule = jest.requireActual('recharts')

  return {
    __esModule: true,
    ...originalModule,
    // eslint-disable-next-line react/prop-types
    ResponsiveContainer: ({ children }) => <div>{children}</div>,
    // eslint-disable-next-line react/prop-types
    LineChart: ({ data, children }) => (
      <div>
        LINE_{data.length}
        {children}
      </div>
    ),
    // eslint-disable-next-line react/prop-types
    ReferenceLine: ({ label, y, stroke }) => (
      <div>{`THRESHOLD_LINE_${label}_${y}_${stroke}`}</div>
    )
  }
})

describe('HistoryChart', () => {
  it('should render the history chart', () => {
    render(<HistoryChart data={testData} />)
    expect(screen.getByText('LINE_3')).toBeInTheDocument()
  })

  it('should render the threshold lines', () => {
    render(
      <HistoryChart
        data={testData}
        thresholds={[
          {
            label: 'T1',
            value: 15,
            color: '#00ff00'
          },
          {
            label: 'T2',
            value: 45,
            color: '#ff0000'
          }
        ]}
      />
    )
    expect(screen.getByText('THRESHOLD_LINE_T1_15_#00ff00')).toBeInTheDocument()
    expect(screen.getByText('THRESHOLD_LINE_T2_45_#ff0000')).toBeInTheDocument()
  })
})
