import { render, screen } from '@testing-library/react'
import {
  NasTemperature,
  OccupiedDiskSpace,
  SynologyDsmAttributes,
  SynologyDsmUpdate,
  SynologySecurityStatus,
  SynologySecurityStatusAttributes,
  SynologyVolumeStatus,
  VolumeTemperature
} from '../SynologyNasServer'
import { getMockedEntityState } from '../../../utils/testUtils'

const testDsmUpdateStatus: SynologyDsmAttributes = {
  installed_version: '6.2.4-25556',
  latest_version: '6.2.4-25556'
}

const testSecurityStatus: SynologySecurityStatusAttributes = {
  malware: 'safe',
  network: 'safe',
  securitySetting: 'safe',
  systemCheck: 'safe',
  update: 'info',
  userInfo: 'safe'
}

jest.mock('../../../api/hooks', () => {
  const originalModule = jest.requireActual('../../../api/hooks')

  return {
    __esModule: true,
    ...originalModule,
    useHomeAssistantEntity: jest.fn(entityId => {
      switch (entityId) {
        case 'update.synologynas_dsm_update':
          return getMockedEntityState(
            'update.synologynas_dsm_update',
            '',
            testDsmUpdateStatus
          )
        case 'binary_sensor.synologynas_security_status':
          return getMockedEntityState(
            'binary_sensor.synologynas_security_status',
            'off',
            testSecurityStatus
          )
        case 'sensor.synologynas_volume_1_status':
          return getMockedEntityState(
            'sensor.synologynas_volume_1_status',
            'normal'
          )
        case 'sensor.synologynas_volume_1_volume_used':
          return getMockedEntityState(
            'sensor.synologynas_volume_1_volume_used',
            '14.58'
          )
        case 'sensor.synologynas_volume_1_average_disk_temp':
          return getMockedEntityState(
            'sensor.synologynas_volume_1_average_disk_temp',
            '37.25'
          )
        case 'sensor.synologynas_temperature':
          return getMockedEntityState('sensor.synologynas_temperature', '43.72')
        default:
          return {
            entityState: null,
            isUnavailable: true
          }
      }
    })
  }
})

// eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
const { useHomeAssistantEntity } = require('../../../api/hooks')

describe('SynologyNasServer', () => {
  it('should render the DSM update tile', () => {
    const { rerender } = render(<SynologyDsmUpdate />)
    expect(screen.getByText('Synology DSM')).toBeInTheDocument()
    expect(screen.getByText('Up to date')).toBeInTheDocument()
    expect(screen.getByTestId('CheckIcon')).toBeInTheDocument()
    const newDsmAttributes: SynologyDsmAttributes = {
      ...testDsmUpdateStatus,
      latest_version: '6.2.4-25557'
    }
    useHomeAssistantEntity.mockImplementationOnce(() =>
      getMockedEntityState('SynologyNAS DSM update', '', newDsmAttributes)
    )
    rerender(<SynologyDsmUpdate />)
    expect(screen.getByText('Synology DSM')).toBeInTheDocument()
    expect(screen.getByText('Update available')).toBeInTheDocument()
    expect(screen.getByTestId('UpdateIcon')).toBeInTheDocument()
    expect(screen.getByTestId('UpdateIcon')).toHaveClass('text-yellow-600')
  })

  it('should render the security status tile', () => {
    const { rerender } = render(<SynologySecurityStatus />)
    expect(screen.getByText('Security status')).toBeInTheDocument()
    expect(screen.getByText('Safe')).toBeInTheDocument()
    expect(screen.getByTestId('CheckIcon')).toBeInTheDocument()
    const newSecurityAttributes: SynologySecurityStatusAttributes = {
      ...testSecurityStatus,
      network: 'unsafe',
      systemCheck: 'unsafe'
    }
    useHomeAssistantEntity.mockImplementationOnce(() =>
      getMockedEntityState(
        'SynologyNAS Security status',
        'on',
        newSecurityAttributes
      )
    )
    rerender(<SynologySecurityStatus />)
    expect(screen.getByText('Security status')).toBeInTheDocument()
    expect(
      screen.getByText('Unsafe: network, systemCheck, update')
    ).toBeInTheDocument()
    expect(screen.getByTestId('UpdateIcon')).toBeInTheDocument()
    expect(screen.getByTestId('UpdateIcon')).toHaveClass('text-yellow-600')
  })

  it('should render the volume status tile', () => {
    const { rerender } = render(<SynologyVolumeStatus />)
    expect(screen.getByText('Volume status')).toBeInTheDocument()
    expect(screen.getByText('normal')).toBeInTheDocument()
    expect(screen.getByTestId('StorageIcon')).toBeInTheDocument()
    expect(screen.getByTestId('StorageIcon')).toHaveClass('text-white')
    useHomeAssistantEntity.mockImplementationOnce(() =>
      getMockedEntityState('SynologyNAS (Volume 1) Status', 'another_state')
    )
    rerender(<SynologyVolumeStatus />)
    expect(screen.getByText('Volume status')).toBeInTheDocument()
    expect(screen.getByText('another_state')).toBeInTheDocument()
    expect(screen.getByTestId('DiscFullIcon')).toBeInTheDocument()
    expect(screen.getByTestId('DiscFullIcon')).toHaveClass('text-red-600')
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
    expect(screen.getByText('NAS system temperature')).toBeInTheDocument()
    expect(screen.getByText('43')).toBeInTheDocument()
    expect(screen.getByText('.7')).toBeInTheDocument()
    expect(screen.getByText('°C')).toBeInTheDocument()
  })
})
