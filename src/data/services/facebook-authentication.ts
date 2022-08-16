import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '../contracts/apis'
import { LoadUserAccountRepository } from '../contracts/db'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepo: LoadUserAccountRepository
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<any> {
    const fbData = await this.loadFacebookUserApi.loadUser(params)
    if (fbData === undefined) {
      return new AuthenticationError()
    }

    await this.loadUserAccountRepo.load({ email: fbData.email })
  }
}
