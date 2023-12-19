import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import useAqaraOppleLogic from '../useAqaraOppleLogic'
import { holdTest } from '../../utils/testUtils'

const triggerRemoteControl = jest.fn()
jest.mock('../../contexts/BackendContext', () => ({
  useBackend: jest.fn(() => ({
    triggerRemoteControl
  }))
}))

const TestButton = () => {
  const events = useAqaraOppleLogic('RC-NAME', 10)
  return <div {...events}>BUTTON</div>
}

describe('useAqaraOppleLogic', () => {
  it('should call mqtt with correct click payload', async () => {
    render(<TestButton />)
    const click = () => {
      fireEvent.mouseDown(screen.getByText('BUTTON'))
      fireEvent.mouseUp(screen.getByText('BUTTON'))
    }
    click()
    await waitFor(() =>
      expect(triggerRemoteControl).toHaveBeenCalledWith(
        'RC-NAME',
        'button_10_single'
      )
    )
    click()
    click()
    await waitFor(() =>
      expect(triggerRemoteControl).toHaveBeenLastCalledWith(
        'RC-NAME',
        'button_10_double'
      )
    )
    click()
    click()
    click()
    await waitFor(() =>
      expect(triggerRemoteControl).toHaveBeenLastCalledWith(
        'RC-NAME',
        'button_10_triple'
      )
    )
  })
  it('should call mqtt with correct hold payload', async () => {
    render(<TestButton />)
    fireEvent.mouseDown(screen.getByText('BUTTON'))
    await holdTest(1100)
    fireEvent.mouseUp(screen.getByText('BUTTON'))
    await waitFor(() =>
      expect(triggerRemoteControl).toHaveBeenCalledWith(
        'RC-NAME',
        'button_10_hold'
      )
    )
  })
})
