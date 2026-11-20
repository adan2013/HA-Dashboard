import { fireEvent, render, screen } from '@testing-library/react'
import RemoteControl, { REMOTE_CATEGORY_STORAGE_KEY } from '../RemoteControl'
import { useLayoutContext } from '../../../contexts/OutletContext'

jest.mock('../../../contexts/OutletContext', () => ({
  useLayoutContext: jest.fn()
}))

function mockTile() {
  return function MockTile({ title }: { title: string }) {
    return <div>{title}</div>
  }
}

jest.mock('../../../components/specialTiles/RemoteControlTile', () =>
  mockTile()
)
jest.mock('../../../components/specialTiles/AirConditionerTile', () =>
  mockTile()
)
jest.mock('../../../components/entityTiles/switch/SwitchTile', () => mockTile())
jest.mock('../../../components/specialTiles/irRemote/PhilipsTvRemoteTile', () =>
  mockTile()
)
jest.mock(
  '../../../components/specialTiles/irRemote/JblSoundbarRemoteTile',
  () => mockTile()
)
jest.mock('../../../components/specialTiles/irRemote/HtpcRemoteTile', () =>
  mockTile()
)

const setMobile = (isMobile: boolean) =>
  (useLayoutContext as jest.Mock).mockReturnValue({ isMobile })

describe('RemoteControl', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('should show all categories with headers on desktop', () => {
    setMobile(false)
    render(<RemoteControl />)
    ;['Lights', 'AC', 'Remotes', 'Other'].forEach(header =>
      expect(screen.getByText(header)).toBeVisible()
    )
    expect(screen.getByText('Living room')).toBeVisible()
    expect(screen.getByText('Gree air conditioner')).toBeVisible()
    expect(screen.getByText('Philips TV')).toBeVisible()
    expect(screen.getByText('Kitchen')).toBeVisible()
    expect(
      screen.queryByTestId('remote-category-switcher')
    ).not.toBeInTheDocument()
  })

  it('should show only Lights on mobile by default', () => {
    setMobile(true)
    render(<RemoteControl />)
    expect(screen.getByTestId('remote-category-switcher')).toBeVisible()
    expect(screen.getByText('Living room')).toBeVisible()
    expect(screen.queryByText('Philips TV')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Lights' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
  })

  it('should switch category on mobile and remember it', () => {
    setMobile(true)
    const { unmount } = render(<RemoteControl />)
    fireEvent.click(screen.getByRole('button', { name: 'Remotes' }))
    expect(screen.getByText('Philips TV')).toBeVisible()
    expect(screen.getByText('JBL Soundbar')).toBeVisible()
    expect(screen.getByText('VHS HTPC')).toBeVisible()
    expect(screen.queryByText('Living room')).not.toBeInTheDocument()
    expect(window.localStorage.getItem(REMOTE_CATEGORY_STORAGE_KEY)).toBe(
      'remotes'
    )

    unmount()
    render(<RemoteControl />)
    expect(screen.getByText('Philips TV')).toBeVisible()
  })

  it('should fall back to Lights for an unknown stored category', () => {
    setMobile(true)
    window.localStorage.setItem(REMOTE_CATEGORY_STORAGE_KEY, 'removed')
    render(<RemoteControl />)
    expect(screen.getByText('Living room')).toBeVisible()
  })
})
