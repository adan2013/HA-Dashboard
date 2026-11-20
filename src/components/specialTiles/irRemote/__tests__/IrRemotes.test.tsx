import { act, fireEvent, render, screen } from '@testing-library/react'
import PhilipsTvRemoteTile from '../PhilipsTvRemoteTile'
import JblSoundbarRemoteTile from '../JblSoundbarRemoteTile'
import HtpcRemoteTile from '../HtpcRemoteTile'
import { htpcCodes, jblSoundbarCodes, philipsTvCodes } from '../irRemoteCodes'

const callService = jest.fn()
jest.mock('../../../../contexts/BackendContext', () => ({
  useBackend: jest.fn(() => ({
    callService
  }))
}))

const pressAndGetCode = async (name: string) => {
  callService.mockClear()
  fireEvent.click(screen.getByRole('button', { name }))
  await act(async () => {
    jest.advanceTimersByTime(500)
  })
  const call = callService.mock.calls[0]
  return call ? JSON.parse(call[3].payload).ir_code_to_send : undefined
}

const expectCodes = (expected: [string, string][]) =>
  expected.reduce(async (previous, [name, code]) => {
    await previous
    expect(await pressAndGetCode(name)).toBe(code)
  }, Promise.resolve())

describe('IR remotes', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  beforeEach(() => {
    callService.mockResolvedValue(undefined)
  })

  it('should map Philips TV buttons to their codes', async () => {
    render(<PhilipsTvRemoteTile title="Philips TV" />)
    expect(screen.getAllByRole('button')).toHaveLength(12)
    await expectCodes([
      ['Power', philipsTvCodes.power],
      ['Input', philipsTvCodes.input],
      ['Up', philipsTvCodes.dpad_up],
      ['Left', philipsTvCodes.dpad_left],
      ['OK', philipsTvCodes.dpad_ok],
      ['Right', philipsTvCodes.dpad_right],
      ['Down', philipsTvCodes.dpad_down],
      ['Back', philipsTvCodes.back],
      ['Home', philipsTvCodes.home],
      ['Mute', philipsTvCodes.vol_mute],
      ['Volume down', philipsTvCodes.vol_down],
      ['Volume up', philipsTvCodes.vol_up]
    ])
  })

  it('should map JBL Soundbar buttons to their codes', async () => {
    render(<JblSoundbarRemoteTile title="JBL Soundbar" />)
    expect(screen.getAllByRole('button')).toHaveLength(8)
    await expectCodes([
      ['Power', jblSoundbarCodes.power],
      ['Mute', jblSoundbarCodes.vol_mute],
      ['TV input', jblSoundbarCodes.input_tv],
      ['Volume up', jblSoundbarCodes.vol_up],
      ['Volume down', jblSoundbarCodes.vol_down],
      ['Play', jblSoundbarCodes.play],
      ['Bass', jblSoundbarCodes.bass],
      ['Bluetooth input', jblSoundbarCodes.input_bt]
    ])
  })

  it('should map HTPC buttons to their codes', async () => {
    render(<HtpcRemoteTile title="VHS HTPC" />)
    expect(screen.getAllByRole('button')).toHaveLength(8)
    await expectCodes([
      ['Power', htpcCodes.power],
      ['Mute', htpcCodes.vol_mute],
      ['Reload', htpcCodes.reload],
      ['Apps', htpcCodes.apps],
      ['Fullscreen', htpcCodes.fullscreen],
      ['Enter OK', htpcCodes.enter],
      ['Volume up ▲', htpcCodes.vol_up],
      ['Volume down ▼', htpcCodes.vol_down]
    ])
  })
})
