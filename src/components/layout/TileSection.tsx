import { ReactNode } from 'react'
import { useBackendStatus, useHomeAssistantStatus } from '../../api/hooks'

type SectionContentProps = {
  children: ReactNode
  waitForConnection?: boolean
}

const TileSection = ({ children, waitForConnection }: SectionContentProps) => {
  const haStatus = useHomeAssistantStatus()
  const backendStatus = useBackendStatus()

  if (waitForConnection && (haStatus !== 'synced' || !backendStatus)) {
    return <div>Connecting...</div> // TODO make a loading spinner or skeleton loader
  }

  return (
    <div className="flex flex-col gap-12 lg:h-[calc(100vh-12rem)] lg:flex-row lg:overflow-y-hidden lg:overflow-x-scroll lg:px-5">
      {children}
    </div>
  )
}

TileSection.defaultProps = {
  waitForConnection: true
}

export default TileSection
