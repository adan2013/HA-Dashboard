import { fireEvent, render, screen } from '@testing-library/react'
import { PresetButton } from '../PresetButton'

const callService = jest.fn()
jest.mock('../../../../contexts/HomeAssistantContext', () => ({
  useHomeAssistant: jest.fn(() => ({
    callService
  }))
}))

describe('PresetButton', () => {
  it('should display provided icon and call ha service on click', () => {
    render(
      <PresetButton
        icon={<div data-testid="icon" />}
        id="entityId"
        brightness={255}
        colorTemp={3000}
      />
    )
    expect(screen.getByTestId('icon')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('icon'))
    expect(callService).toHaveBeenCalledWith('entityId', 'light', 'turn_on', {
      brightness: 255,
      kelvin: 3000
    })
    expect(callService).toHaveBeenCalledTimes(1)
  })
})
