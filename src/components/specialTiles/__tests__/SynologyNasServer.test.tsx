import { render, screen } from '@testing-library/react'
import {
  NasTemperature,
  OccupiedDiskSpace,
  SynologyDsmUpdate,
  SynologySecurityStatus,
  SynologyVolumeStatus,
  VolumeTemperature
} from '../SynologyNasServer'
import { getMockedEntityState } from '../../../utils/testUtils'

jest.mock('../../../api/hooks', () => {
  const originalModule = jest.requireActual('../../../api/hooks')

  return {
    __esModule: true,
    ...originalModule,
    useHomeAssistantEntity: jest.fn(entityName => {
      switch (entityName) {
        case 'SynologyNAS (Volume 1) Status':
          return getMockedEntityState('SynologyNAS (Volume 1) Status', 'normal')
        case 'SynologyNAS (Volume 1) Volume used':
          return getMockedEntityState(
            'SynologyNAS (Volume 1) Volume used',
            '14.58'
          )
        case 'SynologyNAS (Volume 1) Average disk temp':
          return getMockedEntityState(
            'SynologyNAS (Volume 1) Average disk temp',
            '37.25'
          )
        case 'SynologyNAS Temperature':
          return getMockedEntityState('SynologyNAS Temperature', '43.72')
        default:
          return {
            entityState: null,
            isUnavailable: true
          }
      }
    })
  }
})

describe('SynologyNasServer', () => {
  it('should render the DSM update tile', () => {
    render(<SynologyDsmUpdate />)
    // TODO implement test
  })

  it('should render the security status tile', () => {
    render(<SynologySecurityStatus />)
    // TODO implement test
  })

  it('should render the volume status tile', () => {
    render(<SynologyVolumeStatus />)
    expect(screen.getByText('Volume status')).toBeInTheDocument()
    expect(screen.getByText('normal')).toBeInTheDocument()
    expect(screen.getByTestId('StorageIcon')).toBeInTheDocument()
    expect(screen.getByTestId('StorageIcon')).toHaveClass('text-white')
    // TODO test danger state - text + color
  })

  it('should render the occupied disk space tile', () => {
    render(<OccupiedDiskSpace />)
    expect(screen.getByText('Occupied disk space')).toBeInTheDocument()
    expect(screen.getByText('14')).toBeInTheDocument()
    expect(screen.getByText('.5')).toBeInTheDocument()
    expect(screen.getByText('%')).toBeInTheDocument()
  })

  it('should render the volume temperature tile', () => {
    render(<VolumeTemperature />)
    expect(screen.getByText('Volume disk AVG temp')).toBeInTheDocument()
    expect(screen.getByText('37')).toBeInTheDocument()
    expect(screen.getByText('.2')).toBeInTheDocument()
    expect(screen.getByText('°C')).toBeInTheDocument()
  })

  it('should render the NAS temperature tile', () => {
    render(<NasTemperature />)
    expect(screen.getByText('NAS temp')).toBeInTheDocument()
    expect(screen.getByText('43')).toBeInTheDocument()
    expect(screen.getByText('.7')).toBeInTheDocument()
    expect(screen.getByText('°C')).toBeInTheDocument()
  })
})
