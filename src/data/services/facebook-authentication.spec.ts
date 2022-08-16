import { mock, MockProxy } from 'jest-mock-extended'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from './facebook-authentication'
import { LoadFacebookUserApi } from '../contracts/apis'
import { LoadUserAccountRepository } from '../contracts/db'

describe('FacebookAuthenticationService', () => {
  let loadFacebookUserApiSpy: MockProxy<LoadFacebookUserApi>
  let loadUserAccountRepo: MockProxy<LoadUserAccountRepository>
  let sut: FacebookAuthenticationService
  const token = 'any_token'
  beforeEach(() => {
    loadFacebookUserApiSpy = mock()
    loadFacebookUserApiSpy.loadUser.mockResolvedValue({
      name: 'any_facebook_name',
      email: 'any_facebook_email',
      facebookId: 'any_facebook_id'
    })
    loadUserAccountRepo = mock()
    sut = new FacebookAuthenticationService(
      loadFacebookUserApiSpy,
      loadUserAccountRepo
    )
  })

  test('Should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token })

    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledWith({
      token
    })
    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledTimes(1)
  })

  test('Should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApiSpy.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  test('Should call loadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token })

    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({ email: 'any_facebook_email' })
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1)
  })
})
