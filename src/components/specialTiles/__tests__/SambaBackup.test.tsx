import { render, screen } from '@testing-library/react'
import {
  BackupStats,
  SambaBackupAttributes,
  SambaBackupStatus
} from '../SambaBackup'
import { getMockedEntityState } from '../../../utils/testUtils'

const testSambaStats: SambaBackupAttributes = {
  backups_local: '1',
  backups_remote: '2',
  total_backups_succeeded: '3',
  total_backups_failed: '4',
  last_backup: '12345'
}

jest.mock('../../../api/hooks', () => {
  const originalModule = jest.requireActual('../../../api/hooks')

  return {
    __esModule: true,
    ...originalModule,
    useHomeAssistantEntity: jest.fn(entityName => {
      switch (entityName) {
        case 'Samba Backup':
          return getMockedEntityState('Samba Backup', 'IDLE', testSambaStats)
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

describe('SambaBackup', () => {
  it('should render the backup status tile', () => {
    const { rerender } = render(<SambaBackupStatus />)
    expect(screen.getByText('Backup service')).toBeInTheDocument()
    expect(screen.getByText('Standby')).toBeInTheDocument()
    expect(screen.getByTestId('CheckIcon')).toBeInTheDocument()
    expect(screen.getByTestId('CheckIcon')).toHaveClass('text-green-500')

    useHomeAssistantEntity.mockImplementationOnce(() =>
      getMockedEntityState('SynologyNAS DSM update', 'RUNNING', testSambaStats)
    )
    rerender(<SambaBackupStatus />)
    expect(screen.getByText('Running')).toBeInTheDocument()
    expect(screen.getByTestId('CloudSyncIcon')).toBeInTheDocument()
    expect(screen.getByTestId('CloudSyncIcon')).toHaveClass(
      'animate-pulse text-orange-500'
    )

    useHomeAssistantEntity.mockImplementationOnce(() =>
      getMockedEntityState(
        'SynologyNAS DSM update',
        'STRANGE_STATUS',
        testSambaStats
      )
    )
    rerender(<SambaBackupStatus />)
    expect(screen.getByText('strange_status')).toBeInTheDocument()
    expect(screen.getByTestId('QuestionMarkIcon')).toBeInTheDocument()
  })

  it('should render the backup stats tile', () => {
    render(<BackupStats />)
    expect(screen.getByText('Backup stats')).toBeInTheDocument()
    expect(screen.getByText('Stored locally')).toBeInTheDocument()
    expect(screen.getByText('Stored remotely')).toBeInTheDocument()
    expect(screen.getByText('Successful')).toBeInTheDocument()
    expect(screen.getByText('Failed')).toBeInTheDocument()
    expect(screen.getByTestId('Stored locally-value')).toHaveTextContent('1')
    expect(screen.getByTestId('Stored remotely-value')).toHaveTextContent('2')
    expect(screen.getByTestId('Successful-value')).toHaveTextContent('3')
    expect(screen.getByTestId('Failed-value')).toHaveTextContent('4')
    expect(screen.getByText('Last backup: 12345')).toBeInTheDocument()
  })
})
