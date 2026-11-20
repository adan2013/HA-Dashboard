import { act, fireEvent, render, screen, within } from '@testing-library/react'
import IrRemoteTile, { IrRemoteItem } from '../IrRemoteTile'

const callService = jest.fn()
jest.mock('../../../../contexts/BackendContext', () => ({
  useBackend: jest.fn(() => ({
    callService
  }))
}))

const items: IrRemoteItem[] = [
  {
    placement: 'col-start-1',
    buttons: [{ id: 'power', label: 'Power', code: 'P', content: 'PWR' }]
  },
  {
    placement: 'col-start-2',
    direction: 'col',
    buttons: [
      { id: 'up', label: 'Volume up', code: 'U', content: 'V+', sub: '▲' },
      { id: 'down', label: 'Volume down', code: 'D', content: 'V-' }
    ]
  }
]

const sentCode = () =>
  JSON.parse(callService.mock.calls.at(-1)[3].payload).ir_code_to_send

describe('IrRemoteTile', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  beforeEach(() => {
    callService.mockResolvedValue(undefined)
  })

  const renderTile = () =>
    render(
      <IrRemoteTile title="TV" gridClassName="grid-cols-2" items={items} />
    )

  it('should display title, buttons and sub labels', () => {
    renderTile()
    expect(screen.getByText('TV')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Power' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Volume up ▲' })).toBeVisible()
    expect(screen.getByText('▲')).toBeVisible()
    expect(screen.getAllByRole('button')).toHaveLength(3)
  })

  it('should render joined buttons inside one group', () => {
    renderTile()
    const group = screen.getByRole('button', {
      name: 'Volume down'
    }).parentElement as HTMLElement
    expect(group).toHaveAttribute('role', 'group')
    expect(group).toHaveClass(
      'col-start-2',
      'flex-col',
      'hover:border-white',
      'focus-within:border-white'
    )
    expect(within(group).getAllByRole('button')).toHaveLength(2)
  })

  it('should send the code of the pressed button once per click', async () => {
    renderTile()
    fireEvent.click(screen.getByRole('button', { name: 'Volume down' }))
    expect(callService).toHaveBeenCalledTimes(1)
    expect(sentCode()).toBe('D')
    await act(async () => {
      jest.advanceTimersByTime(500)
    })
  })

  it('should mark only the pressed button while the remote is locked', async () => {
    renderTile()
    const power = screen.getByRole('button', { name: 'Power' })
    const volumeUp = screen.getByRole('button', { name: 'Volume up ▲' })
    fireEvent.click(power)
    expect(power).toHaveAttribute('aria-busy', 'true')
    expect(volumeUp).toHaveAttribute('aria-busy', 'false')
    expect(volumeUp).not.toBeDisabled()

    fireEvent.click(volumeUp)
    expect(callService).toHaveBeenCalledTimes(1)

    await act(async () => {
      jest.advanceTimersByTime(500)
    })
    expect(power).toHaveAttribute('aria-busy', 'false')
  })
})
