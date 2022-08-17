import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { FacebookAccount } from '@/domain/models'
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
    const accountData = await this.userAccountRepo.load({
      email: fbData.email
    })
    // applying business rules into domain models
    // the service is just an orquestrator of bussines logic rules
    const fbAccount = new FacebookAccount(fbData, accountData)
    await this.userAccountRepo.saveWithFacebook(fbAccount)
  }
}
