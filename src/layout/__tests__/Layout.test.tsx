import { act, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Layout from '../Layout'
import { defineWindowWidth } from '../../utils/testUtils'

const closeModalMock = jest.fn()
const reconnectBackendMock = jest.fn()
const desktopContentMountMock = jest.fn()
let mockBackendStatus = 'synced'

jest.mock('../../api/hooks', () => ({
  useBackendStatus: () => mockBackendStatus,
  useHomeAssistantStatus: () => 'synced'
}))

jest.mock('../../contexts/BackendContext', () => ({
  useBackend: () => ({
    reconnect: reconnectBackendMock
  })
}))

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

jest.mock('../DesktopLayout', () => {
  const React = jest.requireActual('react')

  const MockContent = () => {
    React.useEffect(() => {
      desktopContentMountMock()
    }, [])
    return <div>DesktopLayout</div>
  }

  return ({ contentKey }: { contentKey?: number }) => (
    <MockContent key={contentKey} />
  )
})
// eslint-disable-next-line react/display-name
jest.mock('../MobileLayout', () => () => <div>MobileLayout</div>)

describe('Layout', () => {
  beforeEach(() => {
    mockBackendStatus = 'synced'
    desktopContentMountMock.mockClear()
  })

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
    act(() => window.onScreenOff())
    expect(window.location.pathname).toBe('/')
    expect(closeModalMock).toHaveBeenCalledTimes(1)
  })

  it('should force a backend reconnect when the PWA is shown again', () => {
    mockBackendStatus = 'disconnected'
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    )

    const pageShowEvent = new Event('pageshow')
    Object.defineProperty(pageShowEvent, 'persisted', { value: true })
    act(() => window.dispatchEvent(pageShowEvent))

    expect(reconnectBackendMock).toHaveBeenCalledTimes(1)
  })

  it('should force a backend reconnect when the PWA returns from background', () => {
    mockBackendStatus = 'disconnected'
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: false
    })
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    )

    act(() => document.dispatchEvent(new Event('visibilitychange')))

    expect(reconnectBackendMock).toHaveBeenCalledTimes(1)
  })

  it('should keep the current connection when the backend is synced', () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    )

    act(() => document.dispatchEvent(new Event('visibilitychange')))

    expect(reconnectBackendMock).not.toHaveBeenCalled()
  })

  it('should remount home content when the screen turns on', () => {
    defineWindowWidth(1024)
    render(
      <MemoryRouter initialEntries={['/']}>
        <Layout />
      </MemoryRouter>
    )
    expect(desktopContentMountMock).toHaveBeenCalledTimes(1)

    act(() => window.onScreenOn())

    expect(desktopContentMountMock).toHaveBeenCalledTimes(2)
  })

  it('should not remount non-home content when the screen turns on', () => {
    defineWindowWidth(1024)
    render(
      <MemoryRouter initialEntries={['/weather']}>
        <Layout />
      </MemoryRouter>
    )
    expect(desktopContentMountMock).toHaveBeenCalledTimes(1)

    act(() => window.onScreenOn())

    expect(desktopContentMountMock).toHaveBeenCalledTimes(1)
  })
})
