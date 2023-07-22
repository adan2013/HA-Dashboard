import axios from 'axios'
import { getEnvVar } from './utils'

type SensorHistoryItem = {
  id: string | number
  time: string
  value: number
}

class HomeAssistantWebSocketAPI {
  private static getApiConfig = () => {
    const host = getEnvVar('VITE_HA_HOST')
    const token = getEnvVar('VITE_HA_TOKEN')
    if (host === '' || token === '') {
      console.error(
        'Home Assistant VITE_HA_HOST and VITE_HA_TOKEN must be provided!'
      )
    }
    return {
      entryPoint: `http://${host}/api`,
      axiosConfig: {
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    }
  }

  static getSensorHistory = (entityId: string): Promise<SensorHistoryItem[]> => {
    const { entryPoint, axiosConfig } = this.getApiConfig()
    return axios
      .get(
        `${entryPoint}/history/period?filter_entity_id=${entityId}&no_attributes`,
        axiosConfig
      )
      .then(response => {
        const data = response?.data[0] || []
        return data.map((item, index) => ({
          id: index,
          time: item.last_updated,
          value: parseFloat(item.state)
        }))
      })
  }
}

export default HomeAssistantWebSocketAPI
