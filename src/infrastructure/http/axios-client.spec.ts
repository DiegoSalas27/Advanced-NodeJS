import axios from 'axios'
import { AxiosHttpClient } from './axios-client'

jest.mock('axios')

describe('AxiosHttpClient', () => {
  let sut: AxiosHttpClient
  let fakeAxios: jest.Mocked<typeof axios>
  let url: string
  let params: object
  beforeAll(() => {
    fakeAxios = axios as jest.Mocked<typeof axios>
    fakeAxios.get.mockResolvedValue({
      status: 200,
      data: 'any_data'
    })
    url = 'any_url'
    params = {
      any: 'any'
    }
  })

  beforeEach(() => {
    sut = new AxiosHttpClient()
  })

  describe('get', () => {
    test('Should call get with correct params', async () => {
      await sut.get({ url, params })

      expect(fakeAxios.get).toHaveBeenCalledWith(url, { params })
      expect(fakeAxios.get).toHaveBeenCalledTimes(1)
    })

    test('Should return data on success', async () => {
      const result = await sut.get({ url, params })

      expect(result).toEqual('any_data')
    })

    test('Should throws if axios.get throws', async () => {
      fakeAxios.get.mockRejectedValueOnce(new Error('http_error'))

      const promise = sut.get({ url, params })

      await expect(promise).rejects.toThrow(new Error('http_error'))
    })
  })
})
