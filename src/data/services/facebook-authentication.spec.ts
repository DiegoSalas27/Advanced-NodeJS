import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'
import { LoadFacebookUserApi } from '../contracts/apis'
import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository
} from '../contracts/db'
import { FacebookAuthenticationService } from './facebook-authentication'
import { FacebookAccount } from '@/domain/models/facebook-account'
import { TokenGenerator } from '../contracts/crypto'
import { AccessToken } from '@/domain/models'

jest.mock('@/domain/models/facebook-account')

describe('FacebookAuthenticationService', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let crypto: MockProxy<TokenGenerator>
  let userAccountRepo: MockProxy<LoadUserAccountRepository> &
  MockProxy<SaveFacebookAccountRepository>
  let sut: FacebookAuthenticationService
  let token: string

  beforeAll(() => {
    token = 'any_token'
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_facebook_name',
      email: 'any_facebook_email',
      facebookId: 'any_facebook_id'
    })
    userAccountRepo = mock()
    userAccountRepo.load.mockResolvedValue(undefined)
    userAccountRepo.saveWithFacebook.mockResolvedValue({ id: 'any_account_id' })
    crypto = mock()
    crypto.generateToken.mockResolvedValue('any_generated_token')
  })

  beforeEach(() => {
    sut = new FacebookAuthenticationService(facebookApi, crypto, userAccountRepo)
  })

  test('Should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token })

    expect(facebookApi.loadUser).toHaveBeenCalledWith({
      token
    })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  test('Should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  test('Should call LoadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token })

    expect(userAccountRepo.load).toHaveBeenCalledWith({
      email: 'any_facebook_email'
    })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  test('Should call SaveFacebookAccountRepository with FacebookAccount', async () => {
    jest.mocked(FacebookAccount).mockImplementation(jest.fn().mockImplementation(() => ({
      any: 'any'
    })))

    await sut.perform({ token })

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
      any: 'any'
    })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  test('Should call TokenGenerator with correct params', async () => {
    await sut.perform({ token })

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs
    })
    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
  })

  test('Should return an AccessToken on success', async () => {
    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AccessToken('any_generated_token'))
  })

  test('Should throw if LoadFacebookUserApi throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('fb_error'))

    const promise = sut.perform({ token })

    expect(promise).rejects.toThrow(new Error('fb_error'))
  })

  test('Should throw if LoadUserAccountRepository throws', async () => {
    userAccountRepo.load.mockRejectedValueOnce(new Error('load_error'))

    const promise = sut.perform({ token })

    expect(promise).rejects.toThrow(new Error('load_error'))
  })

  test('Should throw if LoadUserAccountRepository throws', async () => {
    userAccountRepo.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'))

    const promise = sut.perform({ token })

    expect(promise).rejects.toThrow(new Error('save_error'))
  })

  test('Should throw if TokenGenerator throws', async () => {
    crypto.generateToken.mockRejectedValueOnce(new Error('token_error'))

    const promise = sut.perform({ token })

    expect(promise).rejects.toThrow(new Error('token_error'))
  })
})
