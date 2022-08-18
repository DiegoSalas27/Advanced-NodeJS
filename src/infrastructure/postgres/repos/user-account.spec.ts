import { IBackup } from 'pg-mem'
import { getConnection, getRepository, Repository } from 'typeorm'
import { PgUser } from '../entities'
import { makeFakeDb } from '../mocks/connection'
import { PgUserAccountRepository } from './user-account'

describe('PgUserAccountRepository', () => {
  let sut: PgUserAccountRepository
  let backup: IBackup
  let pgUserRepo: Repository<PgUser>

  beforeAll(async () => {
    const db = await makeFakeDb([PgUser])
    backup = db.backup()
    pgUserRepo = getRepository(PgUser)
  })

  beforeEach(async () => {
    backup.restore()
    sut = new PgUserAccountRepository()
  })

  afterAll(async () => {
    await getConnection().close()
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

  describe('saveWithFacebook', () => {
    test('Should create an account if id is undefined', async () => {
      await sut.saveWithFacebook({
        email: 'any_email',
        name: 'any_name',
        facebookId: 'any_fb_id'
      })

      const pgUser = await pgUserRepo.findOne({ email: 'any_email' })

      expect(pgUser?.id).toBe(1)
    })
  })
})
