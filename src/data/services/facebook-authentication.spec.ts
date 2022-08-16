import { mock, MockProxy } from 'jest-mock-extended'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from './facebook-authentication'
import { LoadFacebookUserApi } from '../contracts/apis'

describe('FacebookAuthenticationService', () => {
  let loadFacebookUserApiSpy: MockProxy<LoadFacebookUserApi>
  let sut: FacebookAuthenticationService
  beforeEach(() => {
    loadFacebookUserApiSpy = mock()
    sut = new FacebookAuthenticationService(loadFacebookUserApiSpy)
  })

  test('Should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token: 'any_token' })

    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledWith({
      token: 'any_token'
    })
    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledTimes(1)
  })

  test('Should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApiSpy.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
