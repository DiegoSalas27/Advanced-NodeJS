import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '../contracts/apis'
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '../contracts/db'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepo: LoadUserAccountRepository,
    private readonly createFacebookAccountRepo: CreateFacebookAccountRepository
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<any> {
    const fbData = await this.loadFacebookUserApi.loadUser(params)
    if (fbData === undefined) {
      return new AuthenticationError()
    }

    await this.loadUserAccountRepo.load({ email: fbData.email })
    await this.createFacebookAccountRepo.createFromFacebook(fbData)
  }
}
