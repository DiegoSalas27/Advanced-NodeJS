import { mock } from 'jest-mock-extended'
import { HttpGetClient, FacebookApi } from './facebook'

describe('FacebookApi', () => {
  const clientId = 'any_client_id'
  const clientSecret = 'any_client_secret'

  test('Should get app token with correct params', async () => {
    const httpClient = mock<HttpGetClient>()

    const sut = new FacebookApi(httpClient, clientId, clientSecret)

    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      }
    })
  })
})
