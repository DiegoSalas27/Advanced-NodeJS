import { newDb } from 'pg-mem'
import { getRepository, Repository } from 'typeorm'
import { PgUser } from '../entities'
import { PgUserAccountRepository } from './user-account'

const makeFakeDb = async (entities?: any[]): Promise<any> => {
  const db = newDb()
  const connection = await db.adapters.createTypeormConnection({
    type: 'postgres',
    entities: entities ?? ['src/infrastructure/postgres/entities/index.ts']
  })

  await connection.synchronize()

  return connection
}

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
