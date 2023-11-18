import { render, screen } from '@testing-library/react'
import BarHistoryChart from '../BarHistoryChart'

const testData: number[] = [40, -30, 10, 70, -1]

jest.mock('recharts', () => {
  const originalModule = jest.requireActual('recharts')

  return {
    __esModule: true,
    ...originalModule,
    // eslint-disable-next-line react/prop-types
    ResponsiveContainer: ({ children }) => <div>{children}</div>,
    // eslint-disable-next-line react/prop-types
    ReferenceLine: ({ y, stroke }) => <div>{`LINE_${y}_${stroke}`}</div>,
    // eslint-disable-next-line react/prop-types
    BarChart: ({ children }) => <div>{children}</div>,
    // eslint-disable-next-line react/prop-types
    Bar: ({ children }) => <div>{children}</div>,
    // eslint-disable-next-line react/prop-types
    Cell: ({ fill }) => <div>{`CELL_${fill}`}</div>,
    // eslint-disable-next-line react/prop-types
    YAxis: ({ domain }) => <div>{`RANGE/${domain[0]}/${domain[1]}`}</div>
  }
})

describe('BarHistoryChart', () => {
  it('should render the bar history chart with min/max values', () => {
    render(<BarHistoryChart history={testData} />)
    expect(screen.getByText('-30')).toBeInTheDocument()
    expect(screen.getByText('MIN')).toBeInTheDocument()
    expect(screen.getByText('MAX')).toBeInTheDocument()
    expect(screen.getByText('70')).toBeInTheDocument()
    expect(screen.getByText('LINE_0_#d6d3d1')).toBeInTheDocument()
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
    expect(screen.getAllByText('CELL_#a855f7')).toHaveLength(5)
  })

  it('should render the chart with custom bar color for positive values only', () => {
    render(<BarHistoryChart history={testData} chartColor="#00ff00" />)
    expect(screen.getAllByText('CELL_#00ff00')).toHaveLength(5)
  })

  it('should render the chart with custom bar color for positive and negative values', () => {
    render(
      <BarHistoryChart
        history={testData}
        chartColor="#ff0000"
        negativeChartColor="#0000ff"
      />
    )
    expect(screen.getAllByText('CELL_#ff0000')).toHaveLength(3)
    expect(screen.getAllByText('CELL_#0000ff')).toHaveLength(2)
  })
})
