import axios from 'axios'
import { AxiosHttpClient } from './axios-client'

jest.mock('axios')

describe('AxiosHttpClient', () => {
  describe('get', () => {
    test('Should call get with correct params', async () => {
      const fakeAxios = axios as jest.Mocked<typeof axios>

      const sut = new AxiosHttpClient()
      await sut.get({
        url: 'any_url',
        params: {
          any: 'any'
        }
      })

      expect(fakeAxios.get).toHaveBeenCalledWith('any_url', {
        params: {
          any: 'any'
        }
      })
      expect(fakeAxios.get).toHaveBeenCalledTimes(1)
    })
  })
})
