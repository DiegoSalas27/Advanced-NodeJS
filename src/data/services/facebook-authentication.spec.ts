import { AuthenticationError } from '@/domain/errors'
import { LoadFacebookUserApi } from '../contracts/apis/facebook'
import { FacebookAuthenticationService } from './facebook-authentication'

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string
  callsCount = 0
  result = undefined

  async loadUser (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    this.token = params.token
    this.callsCount++
    return this.result
  }
}

describe('FacebookAuthenticationService', () => {
  test('Should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookUserApiSpy = new LoadFacebookUserApiSpy()

    const sut = new FacebookAuthenticationService(loadFacebookUserApiSpy)

    await sut.perform({ token: 'any_token' })

    expect(loadFacebookUserApiSpy.token).toBe('any_token')
    expect(loadFacebookUserApiSpy.callsCount).toBe(1)
  })

  test('Should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookUserApiSpy = new LoadFacebookUserApiSpy()
    const sut = new FacebookAuthenticationService(loadFacebookUserApiSpy)

    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
