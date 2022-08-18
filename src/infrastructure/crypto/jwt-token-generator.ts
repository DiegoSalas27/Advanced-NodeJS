import { sign } from 'jsonwebtoken'
import { TokenGenerator } from '@/data/contracts/crypto'

export class JwtTokenGenerator {
  constructor (private readonly secret: string) {}

  async generateToken (params: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const expirationInSeconds = params.expirationInMs / 1000
    const token = sign({ key: params.key }, this.secret, {
      expiresIn: expirationInSeconds
    })

    return token
  }
}
