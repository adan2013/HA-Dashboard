import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { ReactElement } from 'react'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { useModalContext } from '../../../contexts/ModalContext'
import {
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalTitle
} from '../ModalElements'
import { useHomeAssistantBatteries } from '../../../api/hooks'
import { BATTERY_WARNING_THRESHOLD } from '../../specialTiles/BatteryTile'

const getValueCell = (
  value: number | undefined,
  unit: string,
  warningThreshold: number
): ReactElement => (
  <td className="p-2 text-right">
    {value !== undefined && value < warningThreshold && (
      <WarningAmberIcon className="mr-2 text-yellow-500" />
    )}
    {value !== undefined ? `${value}${unit}` : '-'}
  </td>
)

const BatteryListBody = () => {
  const modal = useModalContext()
  const entities = useHomeAssistantBatteries()

  return (
    <ModalBody>
      <ModalTitle>Batteries</ModalTitle>
      <div className="mx-4 text-center">
        <div className="my-4 h-[450px] max-h-[calc(100vh-250px)] overflow-scroll">
          <table className="w-full">
            <thead className="border-b-[1px] border-white">
              <tr>
                <th className="p-2 text-left">Device</th>
                <th className="p-2 text-right">Battery</th>
              </tr>
            </thead>
            <tbody>
              {entities ? (
                entities.map(device => (
                  <tr key={device.friendlyName} className="hover:bg-gray-700">
                    <td className="p-2 text-left">{device.friendlyName}</td>
                    {getValueCell(
                      device.level,
                      '%',
                      BATTERY_WARNING_THRESHOLD
                    )}
                  </tr>
                ))
              ) : (
                <>Loading...</>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ModalFooter>
        <ModalButton
          name="Close"
          icon={<CloseOutlinedIcon />}
          onClick={() => modal.closeModal()}
        />
      </ModalFooter>
    </ModalBody>
  )
}

export default BatteryListBody
