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
class Plugins {
  @Get()
  async getPluginList(
    @Query('limit', ParseNumberPipe({ nullable: true })) limit: number,
    @Query('page', ParseNumberPipe({ nullable: true })) page?: number,
  ) {
    if (!limit) {
      return {
        developers: prisma.draftPlugin.findMany(),
        pagination: undefined,
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
      plugins: prisma.draftPlugin.findMany({
        skip: offset,
        take: limit,
      }),
      pagination: { pages, currentPage: page, pageSize: limit },
    }
  }

  @Get('/:id')
  async getPlugin(@Param('id') id: string) {
    const plugin = await prisma.draftPlugin.findFirst({
      where: {
        id: id as string,
      },
    })

    if (!plugin) {
      throw new NotFoundException('The plugin was not found.')
    }

    return plugin
  }
}

export default createHandler(Plugins)
