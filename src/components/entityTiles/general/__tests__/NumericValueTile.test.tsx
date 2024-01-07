import { render, screen } from '@testing-library/react'
import NumericValueTile, { NumericValueTileProps } from '../NumericValueTile'

jest.mock('../../../../api/hooks', () => ({
  useHomeAssistantEntity: () => ({
    entityState: {
      id: 'entityId',
      state: '24.98',
      lastChanged: '12345',
      lastUpdated: '67890',
      attributes: {
        friendly_name: 'entityName'
      }
    },
    isUnavailable: false
  })
}))

describe('NumericValueTile', () => {
  it('should render numeric value tile in standard configuration', () => {
    render(<NumericValueTile title="TILE" entityId="entityId" unit="W" />)
    expect(screen.getByText('TILE')).toBeInTheDocument()
    expect(screen.getByText('24')).toBeInTheDocument()
    expect(screen.getByText('W')).toBeInTheDocument()
  })

  it('should pass custom props to the tile component', () => {
    render(
      <NumericValueTile
        title="TILE"
        entityId="entityId"
        customTileProps={{
          subtitle: 'SUBTITLE'
        }}
      />
    )
    expect(screen.getByText('SUBTITLE')).toBeInTheDocument()
  })

  it('should display the correct number of decimals', () => {
    const props: NumericValueTileProps = {
      title: 'TILE',
      entityId: 'entityId'
    }
    const { rerender } = render(<NumericValueTile {...props} />)
    expect(screen.getByText('24')).toBeInTheDocument()
    expect(screen.queryByTestId('decimal-value')).not.toBeInTheDocument()
    rerender(<NumericValueTile {...props} showDecimals={1} />)
    expect(screen.getByText('24')).toBeInTheDocument()
    expect(screen.getByTestId('decimal-value')).toHaveTextContent('.9')
    rerender(<NumericValueTile {...props} showDecimals={2} />)
    expect(screen.getByText('24')).toBeInTheDocument()
    expect(screen.getByTestId('decimal-value')).toHaveTextContent('.98')
    rerender(<NumericValueTile {...props} showDecimals={3} />)
    expect(screen.getByText('24')).toBeInTheDocument()
    expect(screen.getByTestId('decimal-value')).toHaveTextContent('.98')
  })
})
