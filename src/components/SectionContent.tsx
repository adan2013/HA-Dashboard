import { ReactNode } from 'react'

type SectionContentProps = {
  children: ReactNode
}

const SectionContent = ({ children }: SectionContentProps) => (
  <div className="flex flex-col">{children}</div>
)

export default SectionContent
