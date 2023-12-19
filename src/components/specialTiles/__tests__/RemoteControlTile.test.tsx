import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import RemoteControlTile, { Button } from '../RemoteControlTile'

const testButtons: Button[] = ['B1', ['B2-1', 'B2-2'], 'B3', 'B4']

const triggerRemoteControl = jest.fn()
jest.mock('../../../contexts/BackendContext', () => ({
  useBackend: jest.fn(() => ({
    triggerRemoteControl
  }))
}))

describe('RemoteControlTile', () => {
  it('should display all buttons', () => {
    render(
      <RemoteControlTile
        title="Remote"
        entityId="rcTest"
        buttons={testButtons}
      />
    )
    expect(screen.getByText('Remote')).toBeVisible()
    expect(screen.getByText('B1')).toBeVisible()
    expect(screen.getByText('B2-1')).toBeVisible()
    expect(screen.getByText('B2-2')).toBeVisible()
    expect(screen.getByText('B3')).toBeVisible()
    expect(screen.getByText('B4')).toBeVisible()
  })

  it('should call mqtt server with the correct payload', async () => {
    render(
      <RemoteControlTile
        title="Remote"
        entityId="rcTest"
        buttons={testButtons}
      />
    )
    fireEvent.mouseDown(screen.getByText('B1'))
    fireEvent.mouseUp(screen.getByText('B1'))
    fireEvent.mouseDown(screen.getByText('B1'))
    fireEvent.mouseUp(screen.getByText('B1'))
    await waitFor(() =>
      expect(triggerRemoteControl).toHaveBeenCalledWith(
        'rcTest',
        'button_1_double'
      )
    )
  })
})
