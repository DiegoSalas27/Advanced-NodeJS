import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { HttpGetClient } from '../http'

interface AppToken {
  access_token: string
}

interface DebugToken {
  data: {
    user_id: string
  }
}

interface UserInfo {
  id: string
  name: string
  email: string
}

export class FacebookApi implements LoadFacebookUserApi {
  private readonly baseUrl = 'https://graph.facebook.com'

  constructor (
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    const { id, name, email } = await this.getUserInfo(params.token)

    return {
      facebookId: id,
      name,
      email
    }
  }

  private async getAppToken (): Promise<AppToken> {
    return await this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })
  }

  private async getDebugToken (clientToken: string): Promise<DebugToken> {
    const { access_token } = await this.getAppToken()
    return await this.httpClient.get({
      url: `${this.baseUrl}/debug_token`,
      params: {
        access_token,
        input_token: clientToken
      }
    })
  }

  private async getUserInfo (clientToken: string): Promise<UserInfo> {
    const { data: { user_id } } = await this.getDebugToken(clientToken)
    return await this.httpClient.get({
      url: `${this.baseUrl}/${user_id}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: clientToken
      }
    })
  }
}
