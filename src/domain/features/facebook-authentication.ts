import { AccessToken } from '@/domain/models'
import { AuthenticationError } from '@/domain/errors'

export interface FacebookAuthentication {
  perform: (
    params: FacebookAuthentication.Params
  ) => Promise<FacebookAuthentication.Result>
}

namespace FacebookAuthentication {
  export interface Params {
    token: string
  }

  export type Result = AccessToken | AuthenticationError
}
