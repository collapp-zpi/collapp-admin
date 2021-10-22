import {
  createHandler,
  Get,
  Param,
  NotFoundException,
  Query,
  ParseNumberPipe,
} from '@storyofams/next-api-decorators'
import { prisma } from '../../../config/PrismaClient'
import { NextAuthGuard } from '../../../shared/utils/apiDecorators'

@NextAuthGuard()
class Developers {
  @Get()
  async getDeveloperList(
    @Query('limit', ParseNumberPipe({ nullable: true })) limit: number,
    @Query('page', ParseNumberPipe({ nullable: true })) page?: number,
  ) {
    if (!limit) {
      return {
        developers: prisma.developerUser.findMany(),
        pagination: undefined,
      }
    }

    page = page ? page : 1
    const offset = (page - 1) * limit
    const developerCount = await prisma.developerUser.count()

    if (offset >= developerCount) {
      throw new NotFoundException('There is not enough developers')
    }

    const pages = Math.ceil(developerCount / limit)

    return {
      developers: prisma.developerUser.findMany({
        skip: offset,
        take: limit,
      }),
      pagination: { pages, currentPage: page, pageSize: limit },
    }
  }

  @Get('?limit=:limit&page=:page')
  getPartOfDeveloperList() {
    return prisma.developerUser.findMany()
  }

  @Get('/:id')
  async getDeveloper(@Param('id') id: string) {
    const developer = await prisma.developerUser.findFirst({
      where: {
        id: id as string,
      },
    })

    if (!developer) {
      throw new NotFoundException('The developer was not found.')
    }

    return developer
  }

  @Get('/:id/plugins')
  getDeveloperPlugins(@Param('id') id: string) {
    return prisma.draftPlugin.findMany({
      where: {
        authorId: id as string,
      },
    })
  }
}

export default createHandler(Developers)
