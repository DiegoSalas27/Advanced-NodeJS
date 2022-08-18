import { newDb } from 'pg-mem'

export const makeFakeDb = async (entities?: any[]): Promise<any> => {
  const db = newDb()
  const connection = await db.adapters.createTypeormConnection({
    type: 'postgres',
    entities: entities ?? ['src/infrastructure/postgres/entities/index.ts']
  })

  await connection.synchronize()

  return connection
}
