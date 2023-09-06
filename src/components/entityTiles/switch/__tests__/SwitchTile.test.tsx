import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import SwitchTile from '../SwitchTile'
import { getMockedEntityState, holdTest } from '../../../../utils/testUtils'

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
    useHomeAssistantEntity: jest.fn(() =>
      getMockedEntityState('entityName', 'on')
    )
  }
})

describe('SwitchTile', () => {
  it('should render turned on SwitchTile and call turn_off service', async () => {
    render(<SwitchTile title="title" entityName="entityName" />)
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('on')).toBeInTheDocument()
    fireEvent.mouseDown(screen.getByText('title'))
    fireEvent.mouseUp(screen.getByText('title'))
    await waitFor(() =>
      expect(callService).toHaveBeenCalledWith(
        'entityName_id',
        'switch',
        'turn_off'
      )
    )
  })

  it('should render turned off SwitchTile and call turn_on service', async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
    const { useHomeAssistantEntity } = require('../../../../api/hooks')
    useHomeAssistantEntity.mockImplementationOnce(() =>
      getMockedEntityState('entityName', 'off')
    )
    render(<SwitchTile title="title" entityName="entityName" />)
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('off')).toBeInTheDocument()
    fireEvent.mouseDown(screen.getByText('title'))
    fireEvent.mouseUp(screen.getByText('title'))
    await waitFor(() =>
      expect(callService).toHaveBeenCalledWith(
        'entityName_id',
        'switch',
        'turn_on'
      )
    )
  })

  it('should disable the toggle option', async () => {
    render(<SwitchTile title="title" entityName="entityName" disableToggle />)
    expect(screen.getByText('title')).toBeInTheDocument()
    fireEvent.mouseDown(screen.getByText('title'))
    fireEvent.mouseUp(screen.getByText('title'))
    await holdTest(1200)
    expect(callService).not.toHaveBeenCalled()
  })

  it('should open confirmation modal instead of calling ha service', async () => {
    render(
      <SwitchTile title="title" entityName="entityName" confirmationRequired />
    )
    expect(screen.getByText('title')).toBeInTheDocument()
    fireEvent.mouseDown(screen.getByText('title'))
    fireEvent.mouseUp(screen.getByText('title'))
    await waitFor(() => expect(openModalMock).toHaveBeenCalledTimes(1))
    expect(callService).not.toHaveBeenCalled()
  })
})
