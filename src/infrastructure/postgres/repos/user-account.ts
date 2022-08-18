import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository
} from '@/data/contracts/repos'
import { getRepository } from 'typeorm'
import { PgUser } from '../entities'

type LoadParams = LoadUserAccountRepository.Params
type LoadResult = LoadUserAccountRepository.Result
type SaveParams = SaveFacebookAccountRepository.Params
type SaveResult = SaveFacebookAccountRepository.Result

export class PgUserAccountRepository
implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  private readonly pgUserRepo = getRepository(PgUser)

  async load (params: LoadParams): Promise<LoadResult> {
    const pgUser = await this.pgUserRepo.findOne({
      where: { email: params.email }
    })
    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      }
    }
  }

  async saveWithFacebook (
    params: SaveParams
  ): Promise<SaveResult> {
    const saveDto = {
      ...(params.id && { id: +params.id }),
      ...(!params.id && { email: params.email }),
      name: params.name,
      facebookId: params.facebookId
    }

    const savedUser = await this.pgUserRepo.save(saveDto)
    return {
      id: savedUser.id.toString()
    }
  }
}
