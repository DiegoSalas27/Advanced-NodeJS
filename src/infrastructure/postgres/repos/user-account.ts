import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repos'
import { getRepository } from 'typeorm'
import { PgUser } from '../entities'

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
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

  async saveWithFacebook (params: SaveFacebookAccountRepository.Params):
  Promise<any> {
    const pgUserRepo = getRepository(PgUser)
    await pgUserRepo.save({
      email: params.email,
      name: params.name,
      facebookId: params.email
    })
  }
}
