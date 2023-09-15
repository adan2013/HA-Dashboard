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
  })

  it('should hide the section names and show extra buttons', () => {
    render(
      <MemoryRouter initialEntries={['/lights']}>
        <DesktopLayout />
      </MemoryRouter>
    )
    sectionTiles.forEach(section => {
      expect(screen.queryByText(section.name)).not.toBeInTheDocument()
    })
    expect(screen.getByTestId('back-button')).toBeVisible()
    expect(screen.getByTestId('notification-button')).toBeVisible()
  })
})
