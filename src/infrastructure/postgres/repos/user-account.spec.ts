import { getRepository, Repository } from 'typeorm'
import { PgUser } from '../entities'
import { makeFakeDb } from '../mocks/connection'
import { PgUserAccountRepository } from './user-account'

describe('PgUserAccountRepository', () => {
  let sut: PgUserAccountRepository
  let connection: any
  let pgUserRepo: Repository<PgUser>

  beforeAll(async () => {
    connection = await makeFakeDb([PgUser])
    pgUserRepo = getRepository(PgUser)
  })

  beforeEach(async () => {
    sut = new PgUserAccountRepository()
    await pgUserRepo.clear()
  })

  afterAll(async () => {
    await connection.close()
  })

  describe('load', () => {
    test('Should return an account if email exists', async () => {
      await pgUserRepo.save({ email: 'any_email' })

      const account = await sut.load({ email: 'any_email' })

      expect(account).toEqual({ id: '1' })
    })

    test('Should return undefined if email does not exists', async () => {
      const account = await sut.load({ email: 'any_email' })

      expect(account).toBeUndefined()
    })
  })
})
