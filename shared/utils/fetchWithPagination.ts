//@ts-nocheck
import { prisma } from 'shared/utils/prismaClient'

export async function fetchWithPagination(
  entityName: string,
  _limit?: number,
  _page?: number,
  whereQuery: any[],
) {
  const limit = (_limit && Number(_limit)) || 20
  const page = (_page && Number(_page)) || 1
  const andQuery = { AND: whereQuery }

  console.log('test pag', limit, page)

  const offset = (page - 1) * limit
  const entityCount = await prisma[entityName].count()

  const pages = Math.ceil(entityCount / limit)

  return {
    entities: await prisma[entityName].findMany({
      skip: offset,
      take: limit,
      where: andQuery,
    }),
    pagination: { pages, page, limit },
  }
}
