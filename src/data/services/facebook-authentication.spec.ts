import { mock, MockProxy } from 'jest-mock-extended'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from './facebook-authentication'
import { LoadFacebookUserApi } from '../contracts/apis'

interface SutTypes {
  sut: FacebookAuthenticationService
  loadFacebookUserApiSpy: MockProxy<LoadFacebookUserApi>
}

const makeSut = (): SutTypes => {
  const loadFacebookUserApiSpy = mock<LoadFacebookUserApi>()
  const sut = new FacebookAuthenticationService(loadFacebookUserApiSpy)

  return {
    sut,
    loadFacebookUserApiSpy
  }
}

describe('FacebookAuthenticationService', () => {
  test('Should call LoadFacebookUserApi with correct params', async () => {
    const { sut, loadFacebookUserApiSpy } = makeSut()

    await sut.perform({ token: 'any_token' })

    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledWith({
      token: 'any_token'
    })
    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledTimes(1)
  })

  test('Should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const { loadFacebookUserApiSpy, sut } = makeSut()

    loadFacebookUserApiSpy.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
