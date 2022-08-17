import { mock } from 'jest-mock-extended'
import { HttpGetClient, FacebookApi } from './facebook'

describe('FacebookApi', () => {
  test('Should get app token', async () => {
    const httpClient = mock<HttpGetClient>()

    const sut = new FacebookApi(httpClient)

    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token'
    })
  })
})
