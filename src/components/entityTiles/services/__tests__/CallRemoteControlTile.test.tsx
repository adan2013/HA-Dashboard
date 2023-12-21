import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import CallRemoteControlTile from '../CallRemoteControlTile'

const triggerRemoteControl = jest.fn()

jest.mock('../../../../contexts/BackendContext', () => ({
  useBackend: jest.fn(() => ({
    triggerRemoteControl
  }))
}))

describe('CallRemoteControlTile', () => {
  it('should call the ha service with correct remote control payload', async () => {
    render(
      <CallRemoteControlTile
        title="title"
        entityId="remoteEntityId"
        button="buttonName"
        icon={<div data-testid="customIcon" />}
      />
    )
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByTestId('customIcon')).toBeInTheDocument()
    fireEvent.mouseDown(screen.getByText('title'))
    fireEvent.mouseUp(screen.getByText('title'))
    await waitFor(() =>
      expect(triggerRemoteControl).toHaveBeenCalledWith(
        'remoteEntityId',
        'buttonName'
      )
    )
    expect(triggerRemoteControl).toHaveBeenCalledTimes(1)
  })
})
