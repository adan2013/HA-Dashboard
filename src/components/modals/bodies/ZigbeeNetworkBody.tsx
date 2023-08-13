import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import clsx from 'clsx'
import { ReactElement, useState } from 'react'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { useModalContext } from '../ModalContext'
import {
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalTitle
} from '../ModalElements'
import { ZigbeeNetworkModalParams } from '../utils'
import { SortMethod, useHomeAssistantZigbeeEntities } from '../../../api/hooks'
import {
  BATTERY_WARNING_THRESHOLD,
  SIGNAL_WARNING_THRESHOLD
} from '../../specialTiles/ZigbeeTiles'

type Tab = {
  name: string
  key: string
}

const tabs: Tab[] = [
  { name: 'All', key: 'all' },
  { name: 'Batteries', key: 'battery' },
  { name: 'Signal quality', key: 'signal' }
]

const getSortMethod = (tab: string): SortMethod => {
  switch (tab) {
    case 'battery':
      return 'battery'
    case 'signal':
      return 'signal'
    default:
      return 'name'
  }
}

const getValueCell = (
  value: number,
  unit: string,
  warningThreshold: number
): ReactElement => (
  <td className="p-2 text-right">
    {value && value < warningThreshold && (
      <WarningAmberIcon className="mr-2 text-yellow-500" />
    )}
    {value ? `${value}${unit}` : '-'}
  </td>
)

const ZigbeeNetworkBody = () => {
  const modal = useModalContext()
  const params = modal.state.params as ZigbeeNetworkModalParams
  const [activeTab, setActiveTab] = useState<string>(params.tab || tabs[0].key)
  const entities = useHomeAssistantZigbeeEntities(getSortMethod(activeTab))

  return (
    <ModalBody>
      <ModalTitle>Zigbee network</ModalTitle>
      <div className="mx-4 text-center">
        <div className="flex flex-col rounded border-2 border-white md:flex-row">
          {tabs.map(({ name, key }) => (
            <div
              key={key}
              onClick={() => setActiveTab(key)}
              className={clsx(
                'flex-center flex-1 cursor-pointer p-1',
                key === activeTab ? 'bg-white text-black' : 'hover:bg-gray-700'
              )}
            >
              {name}
            </div>
          ))}
        </div>
        <div className="my-4 h-[450px] max-h-[calc(100vh-250px)] overflow-scroll">
          <table className="w-full">
            <thead className="border-b-[1px] border-white">
              <tr>
                <th className="p-2 text-left">Device</th>
                <th className="p-2 text-right">Signal</th>
                <th className="p-2 text-right">Battery</th>
              </tr>
            </thead>
            <tbody>
              {entities ? (
                entities.map(device => (
                  <tr key={device.friendlyName} className="hover:bg-gray-700">
                    <td className="p-2 text-left">{device.friendlyName}</td>
                    {getValueCell(
                      device.signal,
                      ' LQ',
                      SIGNAL_WARNING_THRESHOLD
                    )}
                    {getValueCell(
                      device.battery,
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

export default ZigbeeNetworkBody
