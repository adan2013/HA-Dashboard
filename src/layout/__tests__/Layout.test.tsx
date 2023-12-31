import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Layout from '../Layout'
import { defineWindowWidth } from '../../utils/testUtils'

const closeModalMock = jest.fn()
jest.mock('../../contexts/ModalContext', () => {
  const originalModule = jest.requireActual('../../contexts/ModalContext')

  return {
    __esModule: true,
    ...originalModule,
    useModalContext: () => ({
      closeModal: closeModalMock
    })
  }
})

// eslint-disable-next-line react/display-name
jest.mock('../DesktopLayout', () => () => <div>DesktopLayout</div>)
// eslint-disable-next-line react/display-name
jest.mock('../MobileLayout', () => () => <div>MobileLayout</div>)

describe('Layout', () => {
  it('should render DesktopLayout', () => {
    defineWindowWidth(1024)
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    )
    expect(screen.getByText('DesktopLayout')).toBeInTheDocument()
  })

  it('should render MobileLayout', () => {
    defineWindowWidth(1023)
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    )
    expect(screen.getByText('MobileLayout')).toBeInTheDocument()
  })

  it('should detect Fully Kiosk integration', () => {
    const bindMock = jest.fn()
    Object.defineProperty(window, 'fully', {
      configurable: true,
      value: {
        bind: bindMock
      },
      writable: true
    })
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    )
    expect(window.onScreenOn).toBeDefined()
    expect(window.onScreenOff).toBeDefined()
    expect(bindMock).toHaveBeenCalledTimes(2)
  })

  it('should return to home page when Fully Kiosk turn off the screen', () => {
    render(
      <MemoryRouter initialEntries={['/test']}>
        <Layout />
      </MemoryRouter>
    )
    expect(window.onScreenOff).toBeDefined()
    window.onScreenOff()
    expect(window.location.pathname).toBe('/')
    expect(closeModalMock).toHaveBeenCalledTimes(1)
  })
})
