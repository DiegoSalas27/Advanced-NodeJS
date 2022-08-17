import { AccessToken } from './access-token'

describe('AccessToken', () => {
  test('Should create with a value', () => {
    const sut = new AccessToken('any_value')

    expect(sut).toEqual({
      value: 'any_value'
    })
  })
})