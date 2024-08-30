import { fireEvent, screen } from '@testing-library/react'
import { CameraViewModalParams } from '../../../../contexts/modalUtils'
import {
  getMockedEntityState,
  renderModalBody
} from '../../../../utils/testUtils'
import CameraViewBody from '../CameraViewBody'

jest.mock('../../../../api/hooks', () => {
  const originalModule = jest.requireActual('../../../../api/hooks')

  return {
    __esModule: true,
    ...originalModule,
    useHomeAssistantEntity: jest.fn(entityId => {
      if (entityId === 'sensor.camera') {
        return getMockedEntityState(
          'sensor.camera',
          '2024-01-01T00:00:00.000Z',
          {
            entity_picture: '/image-path?access_token=token'
          }
        )
      }
      return {
        isUnavailable: true,
        entityState: null
      }
    })
  }
})

const renderCameraViewBody = (params: CameraViewModalParams) =>
  renderModalBody(<CameraViewBody />, 'cameraView', params)

describe('CameraViewBody', () => {
  it('should render camera image', () => {
    renderCameraViewBody({
      entityId: 'sensor.camera',
      imageHost: 'http://server:8123'
    })
    expect(screen.getByText('1/1/2024 12:00:00 AM')).toBeVisible()
    expect(screen.getByTestId('camera-view')).toBeVisible()
    expect(screen.getByTestId('camera-view')).toHaveAttribute(
      'src',
      'http://server:8123/image-path?access_token=token'
    )
  })

  it('should render camera is unavailable message', () => {
    renderCameraViewBody({
      entityId: 'wrong.entity_id',
      imageHost: 'http://server:8123'
    })
    expect(screen.queryByTestId('camera-view')).not.toBeInTheDocument()
    expect(screen.getByText('Camera is unavailable')).toBeVisible()
  })

  it('should close the modal after clicking the close button', () => {
    const { closeModalMock } = renderCameraViewBody({
      entityId: 'sensor.camera',
      imageHost: 'http://server:8123'
    })
    fireEvent.click(screen.getByTestId('modal-button-Close'))
    expect(closeModalMock).toHaveBeenCalled()
  })
})
