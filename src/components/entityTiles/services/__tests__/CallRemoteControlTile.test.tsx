import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import CallRemoteControlTile from '../CallRemoteControlTile'

const callService = jest.fn()

jest.mock('../../../../contexts/HomeAssistantContext', () => ({
  useHomeAssistant: jest.fn(() => ({
    callService
  }))
}))

describe('CallRemoteControlTile', () => {
  it('should call the ha service with correct remote control payload', async () => {
    render(
      <CallRemoteControlTile
        title="title"
        rcName="rcName"
        button="buttonName"
        icon={<div data-testid="customIcon" />}
      />
    )
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByTestId('customIcon')).toBeInTheDocument()
    fireEvent.mouseDown(screen.getByText('title'))
    fireEvent.mouseUp(screen.getByText('title'))
    await waitFor(() =>
      expect(callService).toHaveBeenCalledWith(undefined, 'mqtt', 'publish', {
        topic: 'dashboard/rc/rcName',
        payload: 'buttonName'
      })
    )
    expect(callService).toHaveBeenCalledTimes(1)
  })
})
