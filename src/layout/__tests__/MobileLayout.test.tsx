import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
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

  it('should use the glass effect on iOS', () => {
    const userAgentDescriptor = Object.getOwnPropertyDescriptor(
      navigator,
      'userAgent'
    )
    Object.defineProperty(navigator, 'userAgent', {
      configurable: true,
      value: 'iPhone'
    })

    try {
      render(
        <MemoryRouter>
          <MobileLayout />
        </MemoryRouter>
      )

      const navigation = screen.getByTestId('mobile-navigation')
      expect(navigation).toHaveClass('mobile-navigation-glass', 'rounded-full')
      expect(
        within(screen.getByTestId('section-Dashboard-highlighted')).getByText(
          'Dashboard'
        )
      ).toHaveClass('sr-only')
    } finally {
      if (userAgentDescriptor) {
        Object.defineProperty(navigator, 'userAgent', userAgentDescriptor)
      } else {
        delete (navigator as { userAgent?: string }).userAgent
      }
    }
  })
})
