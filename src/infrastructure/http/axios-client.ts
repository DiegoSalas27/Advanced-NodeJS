import axios, { AxiosResponse } from 'axios'
import { HttpGetClient } from './client'

export class AxiosHttpClient {
  async get <T>(args: HttpGetClient.Params): Promise<AxiosResponse<T, any>> {
    const result = await axios.get(args.url, { params: args.params })
    return result.data
  }
}
