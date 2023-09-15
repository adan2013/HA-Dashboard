import { render, screen } from '@testing-library/react'
import DurabilityCircleChart from '../DurabilityCircleChart'

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
    Pie: ({ data }) => (
      <div>
        {data.map(item => (
          <div key={item.fill}>{`PIE_DATA_${item.fill}_${item.value}`}</div>
        ))}
      </div>
    )
  }
})

describe('DurabilityCircleChart', () => {
  it('should render durability chart with correct percentage and data payload', () => {
    const { rerender } = render(
      <DurabilityCircleChart durability={60} color="#f0f0f0" />
    )
    expect(screen.getByText('PIE_DATA_#f0f0f0_60')).toBeInTheDocument()
    expect(screen.getByText('PIE_DATA_#868686_40')).toBeInTheDocument()
    rerender(<DurabilityCircleChart durability={-10} color="#f0f0f0" />)
    expect(screen.getByText('PIE_DATA_#f0f0f0_0')).toBeInTheDocument()
    expect(screen.getByText('PIE_DATA_#868686_100')).toBeInTheDocument()
  })
})
