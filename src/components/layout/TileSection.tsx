import { ReactNode } from 'react'
import { TileConnectionContextProvider } from '../../contexts/TileConnectionContext'

type SectionContentProps = {
  children: ReactNode
  waitForConnection?: boolean
}

const TileSection = ({ children, waitForConnection }: SectionContentProps) => {
  return (
    <TileConnectionContextProvider waitForConnection={waitForConnection}>
      <div className="relative">
        <div
          data-testid="section-scroll"
          className="section-scroll section-scroll-fade flex touch-pan-y flex-col gap-12 lg:h-[calc(100vh-12rem)] lg:touch-pan-x lg:snap-x lg:snap-proximity lg:flex-row lg:overflow-x-auto lg:overflow-y-hidden lg:overscroll-x-contain lg:scroll-px-12 lg:px-12"
        >
          {children}
        </div>
      </div>
    </TileConnectionContextProvider>
  )
}

export default TileSection
