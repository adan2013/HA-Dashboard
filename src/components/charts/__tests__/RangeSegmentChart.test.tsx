import { render, screen } from '@testing-library/react'
import RangeSegmentChart, { RangeSegmentChartProps } from '../RangeSegmentChart'

const testProps: RangeSegmentChartProps = {
  value: 2,
  label: 'LABEL',
  thresholds: [-2, -1, 1, 2]
}

jest.mock('recharts', () => {
  const originalModule = jest.requireActual('recharts')

  return {
    __esModule: true,
    ...originalModule,
    // eslint-disable-next-line react/prop-types
    ResponsiveContainer: ({ children }) => <div>{children}</div>,
    // eslint-disable-next-line react/prop-types
    PieChart: ({ children }) => <div>{children}</div>,
    // eslint-disable-next-line react/prop-types
    Pie: ({ children }) => <div>{children}</div>,
    // eslint-disable-next-line react/prop-types
    Cell: ({ name, fill }) => {
      const state = fill === '#6b7280' ? 'OFF' : 'ON'
      return <div data-testid={`CELL_${state}`}>{`${name}_${state}`}</div>
    }
  }
})

describe('RangeSegmentChart', () => {
  it('should render the chart segments and other elements', () => {
    render(<RangeSegmentChart {...testProps} />)
    expect(screen.getByText('A_ON')).toBeInTheDocument()
    expect(screen.getByText('B_ON')).toBeInTheDocument()
    expect(screen.getByText('C_ON')).toBeInTheDocument()
    expect(screen.getByText('D_ON')).toBeInTheDocument()
    expect(screen.getByText('E_OFF')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('LABEL')).toBeInTheDocument()
  })

  it('should render the chart segments in range mode', () => {
    render(<RangeSegmentChart {...testProps} mode="range" />)
    expect(screen.getByText('A_OFF')).toBeInTheDocument()
    expect(screen.getByText('B_OFF')).toBeInTheDocument()
    expect(screen.getByText('C_OFF')).toBeInTheDocument()
    expect(screen.getByText('D_ON')).toBeInTheDocument()
    expect(screen.getByText('E_OFF')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('LABEL')).toBeInTheDocument()
  })

  it.each([
    [1, -3],
    [1, -2],
    [2, -1],
    [3, 0],
    [3, 1],
    [4, 2],
    [5, 3]
  ])(
    'should render %i highlighted segments for value %i',
    (segments, value) => {
      render(<RangeSegmentChart {...testProps} value={value} />)
      expect(screen.getAllByTestId(`CELL_ON`)).toHaveLength(segments)
      expect(screen.queryAllByTestId(`CELL_OFF`)).toHaveLength(5 - segments)
    }
  )

  it('should render custom center value', () => {
    render(<RangeSegmentChart {...testProps} customCenterValue="--" />)
    expect(screen.queryByText('2')).not.toBeInTheDocument()
    expect(screen.getByText('--')).toBeInTheDocument()
    expect(screen.getByText('LABEL')).toBeInTheDocument()
  })
})
