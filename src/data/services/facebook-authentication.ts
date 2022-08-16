import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '../protocols/load-facebook-user-api'

export class FacebookAuthenticationService {
  constructor (private readonly loadFacebookUserApi: LoadFacebookUserApi) {}

  async perform (params: FacebookAuthentication.Params): Promise<void> {
    this.loadFacebookUserApi.loadUser(params)
  }
}
