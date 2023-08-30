import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Tile, { TileProps } from '../Tile'
import TestWrapper from '../../../utils/testUtils'

const testProps: TileProps = {
  title: 'TITLE',
  subtitle: 'SUB_TITLE',
  metadata: ['meta1', 'meta2'],
  value: 'VAL'
}

describe('Tile', () => {
  it('should render a tile with basic values', () => {
    render(
      <TestWrapper>
        <Tile {...testProps} />
      </TestWrapper>
    )
    expect(screen.getByText('TITLE')).toBeVisible()
    expect(screen.getByText('SUB_TITLE')).toBeVisible()
    expect(screen.getByText('meta1')).toBeVisible()
    expect(screen.getByText('meta2')).toBeVisible()
    expect(screen.getByText('VAL')).toBeVisible()
  })

  it('should render a tile with detailed value', () => {
    render(
      <TestWrapper>
        <Tile
          {...testProps}
          value={{ main: 'MAIN', decimal: 'DEC', unit: '%' }}
        />
      </TestWrapper>
    )
    expect(screen.queryByText('VAL')).not.toBeInTheDocument()
    expect(screen.getByText('MAIN')).toBeVisible()
    expect(screen.getByText('.DEC')).toBeVisible()
    expect(screen.getByText('%')).toBeVisible()
  })

  it('should render a tile with a custom body', () => {
    render(
      <TestWrapper>
        <Tile {...testProps} customBody={<div>CUSTOM_BODY</div>} />
      </TestWrapper>
    )
    expect(screen.getByText('CUSTOM_BODY')).toBeVisible()
  })

  it('should render a tile with an icon instead of value', () => {
    render(
      <TestWrapper>
        <Tile
          {...testProps}
          icon={<div data-testid="icon">ICON</div>}
          iconClassnames="custom-class"
        />
      </TestWrapper>
    )
    expect(screen.getByText('ICON')).toBeVisible()
    expect(screen.getByTestId('icon')).toHaveClass('custom-class')
    expect(screen.queryByText('VAL')).not.toBeInTheDocument()
  })

  it('should render a tile with unavailable icon and hide metadata', () => {
    render(
      <TestWrapper>
        <Tile {...testProps} isUnavailable />
      </TestWrapper>
    )
    expect(screen.getByText('TITLE')).toBeVisible()
    expect(screen.getByText('SUB_TITLE')).toBeVisible()
    expect(screen.queryByText('meta1')).not.toBeInTheDocument()
    expect(screen.queryByText('meta2')).not.toBeInTheDocument()
    expect(screen.getByTestId('unavailable-tile')).toBeVisible()
  })

  it('should use opacity and special color when tile is unavailable', () => {
    render(
      <TestWrapper>
        <Tile {...testProps} tileColor="bg-red-500" isUnavailable />
      </TestWrapper>
    )
    expect(screen.getByTestId('tile-bg')).toHaveClass('opacity-50')
    expect(screen.getByTestId('tile-bg')).toHaveClass('bg-blue-600')
  })

  it('should use opacity when tile is turned off', () => {
    render(
      <TestWrapper>
        <Tile {...testProps} tileColor="bg-red-500" isTurnedOff />
      </TestWrapper>
    )
    expect(screen.getByTestId('tile-bg')).toHaveClass('opacity-50')
    expect(screen.getByTestId('tile-bg')).toHaveClass('bg-red-500')
  })

  // TODO click and hold tests
  // TODO disable click and hold if tile is unavailable
})
