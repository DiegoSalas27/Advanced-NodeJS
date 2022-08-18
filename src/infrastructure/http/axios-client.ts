import axios from 'axios'
import { HttpGetClient } from './client'

export class AxiosHttpClient {
  async get (args: HttpGetClient.Params): Promise<void> {
    await axios.get(args.url, { params: args.params })
  }
}
