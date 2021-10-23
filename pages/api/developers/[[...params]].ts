import {
  createHandler,
  Get,
  Param,
  NotFoundException,
  Query,
  ParseNumberPipe,
} from '@storyofams/next-api-decorators'
import { prisma } from 'shared/utils/prismaClient'
import { NextAuthGuard } from 'shared/utils/apiDecorators'

@NextAuthGuard()
class Developers {
  @Get()
  async getDeveloperList(
    @Query('limit', ParseNumberPipe({ nullable: true })) limit?: number,
    @Query('page', ParseNumberPipe({ nullable: true })) page?: number,
  ) {
    if (!limit) {
      return {
        developers: await prisma.developerUser.findMany(),
        pagination: null,
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
      developers: await prisma.developerUser.findMany({
        skip: offset,
        take: limit,
      }),
      pagination: { pages, page, limit },
    }
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
  async getDeveloperPlugins(
    @Param('id') id: string,
    @Query('limit', ParseNumberPipe({ nullable: true })) limit?: number,
    @Query('page', ParseNumberPipe({ nullable: true })) page?: number,
  ) {
    if (!limit) {
      return {
        plugins: await prisma.draftPlugin.findMany({
          where: {
            authorId: id as string,
          },
        }),
        pagination: null,
      }
    }

    page = page ? page : 1
    const offset = (page - 1) * limit
    const pluginCount = await prisma.draftPlugin.count()

    if (offset >= pluginCount) {
      throw new NotFoundException('There is not enough plugins')
    }

    const pages = Math.ceil(pluginCount / limit)

    return {
      plugins: await prisma.draftPlugin.findMany({
        skip: offset,
        take: limit,
        where: {
          authorId: id as string,
        },
      }),
      pagination: { pages, page, limit },
    }
  }
}

export default createHandler(Developers)
