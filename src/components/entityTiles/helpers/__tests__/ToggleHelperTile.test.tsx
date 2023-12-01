import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import ToggleHelperTile, { ToggleHelperTileProps } from '../ToggleHelperTile'
import { getMockedEntityState, holdTest } from '../../../../utils/testUtils'

const callService = jest.fn()
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

// eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
const { useHomeAssistantEntity } = require('../../../../api/hooks')

const testProps: ToggleHelperTileProps = {
  title: 'title',
  entityId: 'entityName',
  onColor: 'on-color-class',
  offColor: 'off-color-class',
  onIcon: <div data-testid="on-icon" />,
  offIcon: <div data-testid="off-icon" />
}

describe('ToggleHelperTile', () => {
  it('should render ToggleHelperTile', () => {
    render(<ToggleHelperTile {...testProps} />)
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('on')).toBeInTheDocument()
    expect(screen.getByTestId('on-icon')).toBeInTheDocument()
    expect(screen.getByTestId('on-icon')).toHaveClass('on-color-class')
  })

  it('should render ToggleHelperTile with reversed state of icon and tile style', () => {
    render(<ToggleHelperTile {...testProps} reverseState />)
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('off')).toBeInTheDocument()
    expect(screen.getByTestId('off-icon')).toBeInTheDocument()
    expect(screen.getByTestId('off-icon')).toHaveClass('off-color-class')
  })

  it('should render ToggleHelperTile in "turned off" state', () => {
    useHomeAssistantEntity.mockImplementationOnce(() =>
      getMockedEntityState('entityName', 'off')
    )
    render(<ToggleHelperTile {...testProps} />)
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('off')).toBeInTheDocument()
    expect(screen.getByTestId('off-icon')).toBeInTheDocument()
    expect(screen.getByTestId('off-icon')).toHaveClass('off-color-class')
  })

  it.each([
    ['on', false, 'turn_off', 'on'],
    ['on', true, 'turn_off', 'off'],
    ['off', false, 'turn_on', 'off'],
    ['off', true, 'turn_on', 'on']
  ])(
    'should render %s state with reverseState set to %s and call the %s service',
    async (state, reversed, service, subtitleWithState) => {
      useHomeAssistantEntity.mockImplementationOnce(() =>
        getMockedEntityState('entityName', state)
      )
      render(<ToggleHelperTile {...testProps} reverseState={reversed} />)
      expect(screen.getByText(subtitleWithState)).toBeInTheDocument()
      fireEvent.mouseDown(screen.getByText('title'))
      fireEvent.mouseUp(screen.getByText('title'))
      await waitFor(() =>
        expect(callService).toHaveBeenCalledWith(
          'entityName_id',
          'input_boolean',
          service
        )
      )
    }
  )

  it('should not call the ha service if tile is in readonly mode', async () => {
    render(<ToggleHelperTile {...testProps} readonly />)
    expect(screen.getByText('on')).toBeInTheDocument()
    fireEvent.mouseDown(screen.getByText('on'))
    fireEvent.mouseUp(screen.getByText('on'))
    await holdTest(500)
    expect(callService).not.toHaveBeenCalled()
  })

  it('should use custom state names', () => {
    const states: [string, string] = ['customOff', 'customOn']
    const { rerender } = render(
      <ToggleHelperTile {...testProps} stateNames={states} />
    )
    expect(screen.getByText('customOn')).toBeInTheDocument()
    expect(screen.queryByText('on')).not.toBeInTheDocument()
    useHomeAssistantEntity.mockImplementationOnce(() =>
      getMockedEntityState('entityName', 'off')
    )
    rerender(<ToggleHelperTile {...testProps} stateNames={states} />)
    expect(screen.getByText('customOff')).toBeInTheDocument()
    expect(screen.queryByText('off')).not.toBeInTheDocument()
  })

  it('should render custom metadata section', () => {
    const metadataRendererMock = jest.fn(() => ['metadata_content'])
    render(
      <ToggleHelperTile
        {...testProps}
        metadataRenderer={metadataRendererMock}
      />
    )
    expect(metadataRendererMock).toHaveBeenCalledWith(
      getMockedEntityState('entityName', 'on').entityState
    )
    expect(screen.getByText('metadata_content')).toBeInTheDocument()
  })

  it('should pass tileProps to the tile component', () => {
    render(
      <ToggleHelperTile
        {...testProps}
        tileProps={{
          title: 'customTitle'
        }}
      />
    )
    expect(screen.queryByText('title')).not.toBeInTheDocument()
    expect(screen.getByText('customTitle')).toBeInTheDocument()
  })

  it('should display unknown state if entity is unavailable and abort calling ha service', async () => {
    useHomeAssistantEntity.mockImplementationOnce(() => ({
      entityState: null,
      isUnavailable: true
    }))
    render(<ToggleHelperTile {...testProps} />)
    expect(screen.getByText('unknown')).toBeInTheDocument()
    fireEvent.mouseDown(screen.getByText('unknown'))
    fireEvent.mouseUp(screen.getByText('unknown'))
    await holdTest(500)
    expect(callService).not.toHaveBeenCalled()
  })
})
