import axios from 'axios'
import HomeAssistantRestAPI from '../HomeAssistantRestAPI'

jest.mock('axios', () => ({
  get: jest
    .fn()
    .mockImplementation(() => Promise.resolve({ status: 200, data: {} }))
}))

describe('HomeAssistantRestAPI', () => {
  it('should call the history api', () => {
    const startDate = '2023-08-27T01:24:36.456Z'
    const endDate = '2023-09-04T15:09:36.456Z'
    const correctHeaders = {
      'Content-Type': 'application/json',
      authorization: 'Bearer ACCESS_TOKEN'
    }
    jest.useFakeTimers().setSystemTime(new Date(endDate))
    HomeAssistantRestAPI.getSensorHistory('ENTITY_ID')
    expect(axios.get).toHaveBeenCalledWith(
      `http://127.0.0.1:8123/api/history/period?filter_entity_id=ENTITY_ID&no_attributes&end_time=${endDate}`,
      {
        headers: correctHeaders
      }
    )
    HomeAssistantRestAPI.getSensorHistory('ENTITY_ID', 12345)
    expect(axios.get).toHaveBeenLastCalledWith(
      `http://127.0.0.1:8123/api/history/period/${startDate}?filter_entity_id=ENTITY_ID&no_attributes&end_time=${endDate}`,
      {
        headers: correctHeaders
      }
    )
  })
})
