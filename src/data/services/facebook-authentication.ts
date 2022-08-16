import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '../contracts/apis'
import {
  CreateFacebookAccountRepository,
  LoadUserAccountRepository,
  UpdateFacebookAccountRepository
} from '../contracts/db'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository &
    CreateFacebookAccountRepository &
    UpdateFacebookAccountRepository
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<any> {
    const fbData = await this.facebookApi.loadUser(params)
    if (fbData === undefined) {
      return new AuthenticationError()
    }
    const accountData = await this.userAccountRepo.load({ email: fbData.email })

    if (accountData !== undefined) {
      await this.userAccountRepo.updateWithFacebook({
        id: accountData.id,
        name: accountData.name ?? fbData.name,
        facebookId: fbData.facebookId
      })
    } else {
      await this.userAccountRepo.createFromFacebook(fbData)
    }
  }
}
