import { render, screen } from '@testing-library/react'
import { ChartData } from '../utils'
import BackgroundHistoryChart from '../BackgroundHistoryChart'

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
    AreaChart: ({ data }) => (
      <div>
        {data.map(item => (
          <div key={item.name}>{`DATA_${item.name}_${item.value}`}</div>
        ))}
      </div>
    )
  }
})

describe('BackgroundHistoryChart', () => {
  it('should render chart with correct data', () => {
    render(<BackgroundHistoryChart data={testData} />)
    expect(screen.getByText('DATA_A_10')).toBeInTheDocument()
    expect(screen.getByText('DATA_B_20')).toBeInTheDocument()
    expect(screen.getByText('DATA_C_30')).toBeInTheDocument()
  })

  it('should clamp the provided values', () => {
    render(
      <BackgroundHistoryChart data={testData} minValue={15} maxValue={25} />
    )
    expect(screen.getByText('DATA_A_15')).toBeInTheDocument()
    expect(screen.getByText('DATA_B_20')).toBeInTheDocument()
    expect(screen.getByText('DATA_C_25')).toBeInTheDocument()
  })
})
