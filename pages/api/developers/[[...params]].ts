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
  async getLimitedDeveloperList(
    @Query('limit', ParseNumberPipe({ nullable: true })) limit: number,
    @Query('offset', ParseNumberPipe({ nullable: true })) offset?: number,
  ) {
    if (!limit) {
      return {
        developers: prisma.developerUser.findMany(),
        pagination: undefined,
      }
    }

    offset = offset ? offset : 0
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
      pagination: undefined,
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
