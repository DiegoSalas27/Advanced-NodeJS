import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '../contracts/apis'

export class FacebookAuthenticationService {
  constructor (private readonly loadFacebookUserApi: LoadFacebookUserApi) {}

  async perform (params: FacebookAuthentication.Params): Promise<any> {
    const res = await this.loadFacebookUserApi.loadUser(params)
    if (res === undefined) {
      return new AuthenticationError()
    }
  }
}
