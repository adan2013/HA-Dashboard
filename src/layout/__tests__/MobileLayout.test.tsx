import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { mobileMenu } from '../menus'
import MobileLayout from '../MobileLayout'

describe('MobileLayout', () => {
  it('should show all the tabs', () => {
    render(
      <MemoryRouter initialEntries={['/weather']}>
        <MobileLayout />
      </MemoryRouter>
    )
    expect(screen.getByTestId('section-Dashboard')).toBeInTheDocument()
    expect(
      screen.getByTestId('section-Weather-highlighted')
    ).toBeInTheDocument()
    expect(screen.getByTestId('section-Notifications')).toBeInTheDocument()
    expect(screen.getByTestId('section-More')).toBeInTheDocument()
  })

  it('should highlight the first tab if nothing is selected', () => {
    render(
      <MemoryRouter initialEntries={['/strange-path']}>
        <MobileLayout />
      </MemoryRouter>
    )
    expect(
      screen.getByTestId('section-Dashboard-highlighted')
    ).toBeInTheDocument()
    expect(screen.getByTestId('section-Weather')).toBeInTheDocument()
    expect(screen.getByTestId('section-Notifications')).toBeInTheDocument()
    expect(screen.getByTestId('section-More')).toBeInTheDocument()
  })
})
