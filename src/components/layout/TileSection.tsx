import { ReactNode } from 'react'
import { useHomeAssistantStatus } from '../../ha/hooks'

type SectionContentProps = {
  children: ReactNode
  waitForHomeAssistantSync?: boolean
}

const TileSection = ({
  children,
  waitForHomeAssistantSync
}: SectionContentProps) => {
  const haStatus = useHomeAssistantStatus()

  if (waitForHomeAssistantSync && haStatus !== 'synced') {
    return <div>Connecting to Home Assistant...</div> // TODO make a loading spinner or skeleton loader
  }

  return (
    <div className="flex flex-col gap-12 lg:h-[calc(100vh-12rem)] lg:flex-row lg:overflow-y-hidden lg:overflow-x-scroll lg:px-5">
      {children}
    </div>
  )
}

TileSection.defaultProps = {
  waitForHomeAssistantSync: true
}

export default TileSection
