import { act, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Layout from '../Layout'
import { defineWindowWidth } from '../../utils/testUtils'

const closeModalMock = jest.fn()
const mockBackend = {
  suspend: jest.fn(),
  resume: jest.fn(() => true)
}
const desktopContentMountMock = jest.fn()

jest.mock('../../api/hooks', () => ({
  useBackendStatus: () => 'synced',
  useHomeAssistantStatus: () => 'synced'
}))

jest.mock('../../contexts/BackendContext', () => ({
  useBackend: () => mockBackend
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

  const MockDesktopLayout = ({ contentKey }: { contentKey?: number }) => (
    <MockContent key={contentKey} />
  )
  MockDesktopLayout.displayName = 'MockDesktopLayout'

  return MockDesktopLayout
})
// eslint-disable-next-line react/display-name
jest.mock('../MobileLayout', () => () => <div>MobileLayout</div>)

describe('Layout', () => {
  beforeEach(() => {
    delete window.fully
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: false
    })
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

  it('should switch layouts on every viewport resize', () => {
    defineWindowWidth(1024)
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    )
    expect(screen.getByText('DesktopLayout')).toBeInTheDocument()

    act(() => {
      defineWindowWidth(1023)
      window.dispatchEvent(new Event('resize'))
    })
    expect(screen.getByText('MobileLayout')).toBeInTheDocument()

    act(() => {
      defineWindowWidth(1024)
      window.dispatchEvent(new Event('resize'))
    })
    expect(screen.getByText('DesktopLayout')).toBeInTheDocument()
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
