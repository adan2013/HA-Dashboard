import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import StateDropdownHelperTile, {
  StateDropdownHelperTileProps
} from '../StateDropdownHelperTile'
import { getMockedEntityState, holdTest } from '../../../../utils/testUtils'

const callService = jest.fn()
const openModalMock = jest.fn()

jest.mock('../../../../contexts/HomeAssistantContext', () => ({
  useHomeAssistant: jest.fn(() => ({
    callService
  }))
}))

jest.mock('../../../../contexts/ModalContext', () => ({
  useModalContext: () => ({
    openModal: openModalMock
  })
}))

jest.mock('../../../../api/hooks', () => {
  const originalModule = jest.requireActual('../../../../api/hooks')

  return {
    __esModule: true,
    ...originalModule,
    useHomeAssistantEntity: jest.fn(() =>
      getMockedEntityState('entityName', 'normal-state')
    )
  }
})

const testProps: StateDropdownHelperTileProps = {
  title: 'title',
  entityId: 'entityName',
  icon: <div data-testid="basic-icon" />,
  iconClassnames: 'basic-icon-classname',
  customStateParams: [
    {
      state: 'custom-state',
      name: 'custom-state-name',
      icon: <div data-testid="custom-state-icon" />,
      iconClassnames: 'custom-state-icon-classname'
    }
  ],
  clickAction: {
    state: 'click-state'
  },
  holdAction: {
    state: 'hold-state',
    confirmationRequired: true,
    message: 'hold-state-change-message',
    isDanger: true
  }
}

// eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
const { useHomeAssistantEntity } = require('../../../../api/hooks')

describe('StateDropdownHelperTile', () => {
  it('should render the tile with a standard state information', () => {
    render(<StateDropdownHelperTile {...testProps} />)
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('normal-state')).toBeInTheDocument()
    expect(screen.getByTestId('basic-icon')).toBeInTheDocument()
    expect(screen.getByTestId('basic-icon')).toHaveClass('basic-icon-classname')
  })

  it('should pass custom tile props to the tile component', () => {
    render(
      <StateDropdownHelperTile
        {...testProps}
        customTileProps={{
          title: 'custom-tile-title'
        }}
      />
    )
    expect(screen.getByText('custom-tile-title')).toBeInTheDocument()
    expect(screen.queryByText('title')).not.toBeInTheDocument()
  })

  it('should use custom state params', () => {
    useHomeAssistantEntity.mockImplementationOnce(() =>
      getMockedEntityState('entityName', 'custom-state')
    )
    render(<StateDropdownHelperTile {...testProps} />)
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.queryByText('custom-state')).not.toBeInTheDocument()
    expect(screen.getByText('custom-state-name')).toBeInTheDocument()
    expect(screen.getByTestId('custom-state-icon')).toBeInTheDocument()
    expect(screen.getByTestId('custom-state-icon')).toHaveClass(
      'custom-state-icon-classname'
    )
  })

  it('should call state change service without confirmation', async () => {
    render(<StateDropdownHelperTile {...testProps} />)
    expect(screen.getByText('normal-state')).toBeInTheDocument()
    fireEvent.mouseDown(screen.getByText('normal-state'))
    fireEvent.mouseUp(screen.getByText('normal-state'))
    await waitFor(() =>
      expect(callService).toHaveBeenCalledWith(
        'entityName_id',
        'input_select',
        'select_option',
        {
          option: 'click-state'
        }
      )
    )
  })

  it('should open the confirmation modal without calling the ha service', async () => {
    render(<StateDropdownHelperTile {...testProps} />)
    expect(screen.getByText('normal-state')).toBeInTheDocument()
    fireEvent.mouseDown(screen.getByText('normal-state'))
    await holdTest(1100)
    fireEvent.mouseUp(screen.getByText('normal-state'))
    await waitFor(() =>
      expect(openModalMock).toHaveBeenCalledWith(
        'confirmation',
        expect.objectContaining({
          isDanger: true,
          message: 'hold-state-change-message'
        })
      )
    )
    expect(callService).not.toHaveBeenCalled()
  })
})
