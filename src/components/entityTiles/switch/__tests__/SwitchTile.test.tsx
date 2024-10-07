import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import SwitchTile from '../SwitchTile'
import { getMockedEntityState } from '../../../../utils/testUtils'

const openModalMock = jest.fn()
const callService = jest.fn()
jest.mock('../../../../contexts/ModalContext', () => ({
  useModalContext: () => ({
    openModal: openModalMock
  })
}))

jest.mock('../../../../contexts/HomeAssistantContext', () => ({
  useHomeAssistant: jest.fn(() => ({
    callService
  }))
}))

jest.mock('../../../../api/hooks', () => {
  const originalModule = jest.requireActual('../../../../api/hooks')

  return {
    __esModule: true,
    ...originalModule,
    useHomeAssistantEntity: jest.fn(() => getMockedEntityState('entity', 'on'))
  }
})

describe('SwitchTile', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  it('should render turned on SwitchTile and call turn_off service', async () => {
    render(<SwitchTile title="title" entityId="entityName" />)
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('on')).toBeInTheDocument()
    expect(screen.getByTestId('PowerIcon')).toBeInTheDocument()
    fireEvent.mouseDown(screen.getByText('title'))
    fireEvent.mouseUp(screen.getByText('title'))
    await waitFor(() =>
      expect(callService).toHaveBeenCalledWith('entity', 'switch', 'turn_off')
    )
  })

  it('should render turned off SwitchTile and call turn_on service', async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
    const { useHomeAssistantEntity } = require('../../../../api/hooks')
    useHomeAssistantEntity.mockImplementationOnce(() =>
      getMockedEntityState('entity', 'off')
    )
    render(<SwitchTile title="title" entityId="entityName" />)
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('off')).toBeInTheDocument()
    expect(screen.getByTestId('PowerOffIcon')).toBeInTheDocument()
    fireEvent.mouseDown(screen.getByText('title'))
    fireEvent.mouseUp(screen.getByText('title'))
    await waitFor(() =>
      expect(callService).toHaveBeenCalledWith('entity', 'switch', 'turn_on')
    )
  })

  it('should use custom on icon', () => {
    render(
      <SwitchTile
        title="title"
        entityId="entityName"
        onIcon={<div data-testid="custom-on" />}
      />
    )
    expect(screen.getByTestId('custom-on')).toBeInTheDocument()
  })

  it('should use custom off icon', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
    const { useHomeAssistantEntity } = require('../../../../api/hooks')
    useHomeAssistantEntity.mockImplementationOnce(() =>
      getMockedEntityState('entity', 'off')
    )
    render(
      <SwitchTile
        title="title"
        entityId="entityName"
        offIcon={<div data-testid="custom-off" />}
      />
    )
    expect(screen.getByTestId('custom-off')).toBeInTheDocument()
  })

  it('should disable the toggle option', () => {
    render(<SwitchTile title="title" entityId="entityName" disableToggle />)
    expect(screen.getByText('title')).toBeInTheDocument()
    fireEvent.mouseDown(screen.getByText('title'))
    fireEvent.mouseUp(screen.getByText('title'))
    jest.advanceTimersByTime(500)
    expect(callService).not.toHaveBeenCalled()
  })

  it('should open confirmation modal instead of calling ha service', async () => {
    render(
      <SwitchTile title="title" entityId="entityName" confirmationRequired />
    )
    expect(screen.getByText('title')).toBeInTheDocument()
    fireEvent.mouseDown(screen.getByText('title'))
    fireEvent.mouseUp(screen.getByText('title'))
    await waitFor(() => expect(openModalMock).toHaveBeenCalledTimes(1))
    expect(callService).not.toHaveBeenCalled()
  })
})
