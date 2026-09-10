import { ReactNode } from 'react'
import { TileConnectionContextProvider } from '../../contexts/TileConnectionContext'

type SectionContentProps = {
  children: ReactNode
  waitForConnection?: boolean
}

const TileSection = ({ children, waitForConnection }: SectionContentProps) => (
  <TileConnectionContextProvider waitForConnection={waitForConnection}>
    <div className="flex flex-col gap-12 lg:h-[calc(100vh-12rem)] lg:flex-row lg:overflow-y-hidden lg:overflow-x-scroll lg:px-5">
      {children}
    </div>
  </TileConnectionContextProvider>
)

export default TileSection
