import { Entity, PrimaryGeneratedColumn, Column, getRepository, Repository } from 'typeorm'
import { newDb } from 'pg-mem'
import { LoadUserAccountRepository } from '@/data/contracts/repos'

class PgUserAccountRepository implements LoadUserAccountRepository {
  async load (
    params: LoadUserAccountRepository.Params
  ): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ where: { email: params.email } })
    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      }
    }
  }
}

@Entity({ name: 'usuarios' })
class PgUser {
  @PrimaryGeneratedColumn()
    id!: number

  @Column({ name: 'nome', nullable: true })
    name?: string

  @Column()
    email!: string

  @Column({ name: 'id_facebook', nullable: true })
    facebookId?: string
}

describe('PgUserAccountRepository', () => {
  let sut: PgUserAccountRepository
  let connection: any
  let pgUserRepo: Repository<PgUser>

  beforeAll(async () => {
    const db = newDb()
    connection = await db.adapters.createTypeormConnection({
      type: 'postgres',
      entities: [PgUser]
    })

    await connection.synchronize()
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
