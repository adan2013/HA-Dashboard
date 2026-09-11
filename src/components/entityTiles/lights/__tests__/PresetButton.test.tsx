import { fireEvent, render, screen } from '@testing-library/react'
import { PresetButton } from '../PresetButton'

const callService = jest.fn()
jest.mock('../../../../contexts/BackendContext', () => ({
  useBackend: jest.fn(() => ({
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
    expect(
      screen.getByRole('button', { name: 'Apply light preset' })
    ).toHaveClass('press-feedback')
    fireEvent.click(screen.getByTestId('icon'))
    expect(callService).toHaveBeenCalledWith('entityId', 'light', 'turn_on', {
      brightness: 255,
      color_temp_kelvin: 3000
    })
    expect(callService).toHaveBeenCalledTimes(1)
  })
})
