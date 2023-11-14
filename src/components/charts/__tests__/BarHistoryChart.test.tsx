import { render, screen } from '@testing-library/react'
import BarHistoryChart from '../BarHistoryChart'

const testData: number[] = [40, 30, 10, 70, 25]

jest.mock('recharts', () => {
  const originalModule = jest.requireActual('recharts')

  return {
    __esModule: true,
    ...originalModule,
    // eslint-disable-next-line react/prop-types
    ResponsiveContainer: ({ children }) => <div>{children}</div>,
    // eslint-disable-next-line react/prop-types
    BarChart: ({ children }) => <div>{children}</div>,
    // eslint-disable-next-line react/prop-types
    Bar: ({ fill }) => <div>{`BAR_FILL_${fill}`}</div>,
    // eslint-disable-next-line react/prop-types
    YAxis: ({ domain }) => <div>{`RANGE/${domain[0]}/${domain[1]}`}</div>
  }
})

describe('BarHistoryChart', () => {
  it('should render the bar history chart with min/max values', () => {
    render(<BarHistoryChart history={testData} />)
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('MIN')).toBeInTheDocument()
    expect(screen.getByText('MAX')).toBeInTheDocument()
    expect(screen.getByText('70')).toBeInTheDocument()
  })

  it('should render the chart with default 0 min value', () => {
    render(<BarHistoryChart history={testData} />)
    expect(screen.getByText('RANGE/0/dataMax')).toBeInTheDocument()
  })

  it('should render the chart and range with offset', () => {
    render(<BarHistoryChart history={testData} minRangeOffset={6} />)
    expect(screen.getByText('RANGE/dataMin - 6/dataMax')).toBeInTheDocument()
  })

  it('should render the chart with default bar color', () => {
    render(<BarHistoryChart history={testData} />)
    expect(screen.getByText('BAR_FILL_#a855f7')).toBeInTheDocument()
  })

  it('should render the chart with custom bar color', () => {
    render(<BarHistoryChart history={testData} chartColor="#00ff00" />)
    expect(screen.getByText('BAR_FILL_#00ff00')).toBeInTheDocument()
  })
})
