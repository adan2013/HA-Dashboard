import { fireEvent, render, screen } from '@testing-library/react'
import Tile, { TileProps } from '../Tile'

const testProps: TileProps = {
  title: 'TITLE',
  subtitle: 'SUB_TITLE',
  metadata: ['meta1', 'meta2'],
  value: 'VAL'
}

describe('Tile', () => {
  it('should render a tile with basic values', () => {
    render(<Tile {...testProps} />)
    expect(screen.getByText('TITLE')).toBeVisible()
    expect(screen.getByText('SUB_TITLE')).toBeVisible()
    expect(screen.getByText('meta1')).toBeVisible()
    expect(screen.getByText('meta2')).toBeVisible()
    expect(screen.getByText('VAL')).toBeVisible()
  })

  it('should render a tile with detailed value', () => {
    render(
      <Tile
        {...testProps}
        value={{ main: 'MAIN', decimal: 'DEC', unit: '%' }}
      />
    )
    expect(screen.queryByText('VAL')).not.toBeInTheDocument()
    expect(screen.getByText('MAIN')).toBeVisible()
    expect(screen.getByText('.DEC')).toBeVisible()
    expect(screen.getByText('%')).toBeVisible()
  })

  it('should render a tile with a custom body', () => {
    render(<Tile {...testProps} customBody={<div>CUSTOM_BODY</div>} />)
    expect(screen.getByText('CUSTOM_BODY')).toBeVisible()
  })

  it('should render a tile with an icon instead of value', () => {
    render(
      <Tile
        {...testProps}
        icon={<div data-testid="icon">ICON</div>}
        iconClassnames="custom-class"
      />
    )
    expect(screen.getByText('ICON')).toBeVisible()
    expect(screen.getByTestId('icon')).toHaveClass('custom-class')
    expect(screen.queryByText('VAL')).not.toBeInTheDocument()
  })

  it('should render a tile with unavailable icon and hide metadata', () => {
    render(<Tile {...testProps} isUnavailable />)
    expect(screen.getByText('TITLE')).toBeVisible()
    expect(screen.getByText('SUB_TITLE')).toBeVisible()
    expect(screen.queryByText('meta1')).not.toBeInTheDocument()
    expect(screen.queryByText('meta2')).not.toBeInTheDocument()
    expect(screen.getByTestId('unavailable-tile')).toBeVisible()
  })

  it('should use opacity and special color when tile is unavailable', () => {
    render(<Tile {...testProps} tileColor="bg-red-500" isUnavailable />)
    expect(screen.getByTestId('tile-bg')).toHaveClass('opacity-50')
    expect(screen.getByTestId('tile-bg')).toHaveClass('bg-blue-600')
  })

  it('should use opacity when tile is turned off', () => {
    render(<Tile {...testProps} tileColor="bg-red-500" isTurnedOff />)
    expect(screen.getByTestId('tile-bg')).toHaveClass('opacity-50')
    expect(screen.getByTestId('tile-bg')).toHaveClass('bg-red-500')
  })

  it('should trigger onClick event and disable event if tile is unavailable', () => {
    const onClick = jest.fn()
    const { rerender } = render(<Tile {...testProps} onClick={onClick} />)
    fireEvent.mouseDown(screen.getByTestId('tile-bg'))
    fireEvent.mouseUp(screen.getByTestId('tile-bg'))
    expect(onClick).toHaveBeenCalledTimes(1)
    rerender(<Tile {...testProps} onClick={onClick} isUnavailable />)
    fireEvent.mouseDown(screen.getByTestId('tile-bg'))
    fireEvent.mouseUp(screen.getByTestId('tile-bg'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
