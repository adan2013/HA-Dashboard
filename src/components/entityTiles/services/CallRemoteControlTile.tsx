import { ReactElement } from 'react'
import CallServiceTile from './CallServiceTile'

type CallRemoteControlTileProps = {
  title: string
  icon?: ReactElement
  rcName: string
  button: string
}

const CallRemoteControlTile = ({
  title,
  icon,
  rcName,
  button
}: CallRemoteControlTileProps) => (
  <CallServiceTile
    domain="mqtt"
    service="publish"
    payload={{
      topic: `dashboard/rc/${rcName}`,
      payload: button
    }}
    title={title}
    icon={icon}
  />
)

export default CallRemoteControlTile
