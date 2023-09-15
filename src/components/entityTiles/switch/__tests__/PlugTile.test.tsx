import { render, screen } from '@testing-library/react'
import { getMockedEntityState } from '../../../../utils/testUtils'
import { EnergyConsumptionChartTile, PowerChartTile } from '../PlugTile'

jest.mock('../../../../api/hooks', () => {
  const originalModule = jest.requireActual('../../../../api/hooks')

  return {
    __esModule: true,
    ...originalModule,
    useHomeAssistantEntity: jest.fn(() =>
      getMockedEntityState('entityName', '14.521')
    )
  }
})

describe('PlugTile', () => {
  it('should render PowerChart tile with custom props', () => {
    render(
      <PowerChartTile
        title="title"
        entityName="entityName"
        customProps={{
          unit: '%'
        }}
      />
    )
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('14')).toBeInTheDocument()
    expect(screen.getByText('.5')).toBeInTheDocument()
    expect(screen.getByText('%')).toBeInTheDocument()
  })

  it('should render EnergyConsumption tile with custom props', () => {
    render(
      <EnergyConsumptionChartTile
        title="title"
        entityName="entityName"
        customProps={{
          unit: '%'
        }}
      />
    )
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('14')).toBeInTheDocument()
    expect(screen.getByText('.52')).toBeInTheDocument()
    expect(screen.getByText('%')).toBeInTheDocument()
  })
})
