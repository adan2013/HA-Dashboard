import { ReactNode } from 'react'

const TileValueBody = ({ children }: { children: ReactNode }) => (
  <div className="absolute bottom-1 right-2 max-w-[calc(100%-1rem)] break-all text-4xl tabular-nums">
    {children}
  </div>
)

export default TileValueBody
