import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import DesktopLayout from '../DesktopLayout'
import { sectionTiles } from '../menus'

describe('DesktopLayout', () => {
  it('should show the names of the section', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <DesktopLayout />
      </MemoryRouter>
    )
    sectionTiles.forEach(section => {
      expect(screen.getByText(section.name)).toBeVisible()
    })
    expect(screen.getByTestId('route-content')).toHaveClass('route-transition')
  })

  it('should keep the expanded layer hidden and show compact controls', () => {
    render(
      <MemoryRouter initialEntries={['/section/lights']}>
        <DesktopLayout />
      </MemoryRouter>
    )
    sectionTiles.forEach(section => {
      expect(screen.getAllByText(section.name).length).toBeGreaterThanOrEqual(1)
    })
    expect(screen.getByTestId('desktop-navigation-expanded')).toHaveAttribute(
      'aria-hidden',
      'true'
    )
    expect(screen.getByTestId('back-button')).toBeVisible()
    expect(screen.getByTestId('notification-button')).toBeVisible()
    expect(screen.getByTestId('back-button')).toHaveClass(
      'inset-y-0',
      'flex',
      'items-center'
    )
    expect(screen.getByTestId('notification-button')).toHaveClass(
      'inset-y-0',
      'flex',
      'items-center'
    )
    expect(screen.getByTestId('back-button')).not.toHaveClass('top-5')
    expect(screen.getByTestId('notification-button')).not.toHaveClass('top-5')
  })

  it('should animate the panel with stable geometry and compositor transforms', () => {
    render(
      <MemoryRouter initialEntries={['/section/lights']}>
        <DesktopLayout />
      </MemoryRouter>
    )

    expect(screen.getByTestId('desktop-navigation-panel')).toHaveClass(
      'h-56',
      'translate-y-36',
      'transition-transform'
    )
    expect(screen.getByTestId('desktop-navigation-compact')).toHaveAttribute(
      'aria-hidden',
      'false'
    )
  })
})
