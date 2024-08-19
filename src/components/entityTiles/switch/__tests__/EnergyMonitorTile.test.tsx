import { render, screen } from '@testing-library/react'
import EnergyMonitorTile from '../EnergyMonitorTile'

const backendMock = {
  subscribeToServiceData: jest.fn(cb =>
    cb({
      energyMonitor: {
        monitors: [
          {
            deviceName: 'testDevice',
            consumedEnergy: {
              total: 42.05,
              monthly: 1.23,
              daily: 0.1,
              runtime: 0
            },
            initialValues: {
              inThisMonth: 42.05,
              inThisDay: 42.05,
              inThisRuntime: 42.05
            }
          }
        ]
      }
    })
  )
}

jest.mock('../../../../contexts/BackendContext', () => ({
  useBackend: jest.fn(() => backendMock)
}))

describe('EnergyMonitorTile', () => {
  it('should render the tile with the correct values', () => {
    render(<EnergyMonitorTile deviceName="testDevice" title="TITLE" />)
    expect(screen.getByText('TITLE [kWh]')).toBeVisible()
    expect(screen.getByTestId('Runtime-value')).toHaveTextContent('0.00')
    expect(screen.getByTestId('Daily-value')).toHaveTextContent('0.10')
    expect(screen.getByTestId('Monthly-value')).toHaveTextContent('1.23')
  })

  it('should render the tile with -- if device do not exist', () => {
    render(<EnergyMonitorTile deviceName="nonExistingDevice" title="TITLE" />)
    expect(screen.getByText('TITLE [kWh]')).toBeVisible()
    expect(screen.getByTestId('Runtime-value')).toHaveTextContent('--')
    expect(screen.getByTestId('Daily-value')).toHaveTextContent('--')
    expect(screen.getByTestId('Monthly-value')).toHaveTextContent('--')
  })
})
