import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '../contracts/apis'
import {
  SaveFacebookAccountRepository,
  LoadUserAccountRepository
} from '../contracts/db'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository &
    SaveFacebookAccountRepository
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<any> {
    const fbData = await this.facebookApi.loadUser(params)
    if (fbData === undefined) {
      return new AuthenticationError()
    }
    const accountData = await this.userAccountRepo.load({ email: fbData.email })
    await this.userAccountRepo.saveWithFacebook({
      id: accountData?.id,
      name: accountData?.name ?? fbData.name,
      email: fbData.email,
      facebookId: fbData.facebookId
    })
  }
}
