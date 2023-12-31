import { useCallback, useEffect, useState } from 'react'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined'
import ZoomOutOutlinedIcon from '@mui/icons-material/ZoomOutOutlined'
import ZoomInOutlinedIcon from '@mui/icons-material/ZoomInOutlined'
import { useModalContext } from '../../../contexts/ModalContext'
import {
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalTitle
} from '../ModalElements'
import { HistoryChartModalParams } from '../../../contexts/modalUtils'
import HomeAssistantRestAPI from '../../../api/HomeAssistantRestAPI'
import HistoryChart from '../../charts/HistoryChart'
import { ChartData } from '../../charts/utils'
import Spinner from '../../basic/Spinner'

const ZOOM_VALUES = [7200, 4320, 2880, 2160, 0, 360]

const HistoryChartBody = () => {
  const [history, setHistory] = useState<ChartData[]>(null)
  const [zoom, setZoom] = useState(4)
  const modal = useModalContext()
  const params = modal.state.params as HistoryChartModalParams

  const loadHistory = useCallback(() => {
    setHistory(null)
    const zoomValue = ZOOM_VALUES[zoom]
    HomeAssistantRestAPI.getSensorHistory(params.entityId, zoomValue).then(
      data => {
        setHistory(
          data.map(item => {
            const time = new Date(item.time)
            const now = new Date()
            const difference = (now.getTime() - time.getTime()) / 3600000
            const hours = Math.floor(difference)
            const minutes = Math.floor((difference - hours) * 60)
            return {
              id: time.toISOString(),
              name: `-${hours}:${minutes < 10 ? `0${minutes}` : minutes}`,
              value: item.value
            }
          })
        )
      }
    )
  }, [zoom, params.entityId])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const zoomOutDisabled = zoom === 0
  const zoomInDisabled = zoom === ZOOM_VALUES.length - 1
  const zoomOut = () => setZoom(c => c - 1)
  const zoomIn = () => setZoom(c => c + 1)

  return (
    <ModalBody>
      <ModalTitle>{params.title}</ModalTitle>
      <div className="mx-4 h-[550px] max-h-[calc(100vh-170px)] text-center">
        {history ? (
          <HistoryChart
            data={history}
            thresholds={params.graphValueThresholds}
          />
        ) : (
          <Spinner />
        )}
      </div>
      <ModalFooter>
        <ModalButton
          name="Zoom out"
          icon={<ZoomOutOutlinedIcon />}
          isDisabled={zoomOutDisabled}
          onClick={zoomOut}
        />
        <ModalButton
          name="Zoom in"
          icon={<ZoomInOutlinedIcon />}
          isDisabled={zoomInDisabled}
          onClick={zoomIn}
        />
        <ModalButton
          name="Refresh"
          icon={<CachedOutlinedIcon />}
          onClick={loadHistory}
        />
        <ModalButton
          name="Close"
          icon={<CloseOutlinedIcon />}
          onClick={() => modal.closeModal()}
        />
      </ModalFooter>
    </ModalBody>
  )
}

export default HistoryChartBody
