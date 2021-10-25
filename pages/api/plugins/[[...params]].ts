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
class Plugins {
  @Get()
  async getPluginList(
    @Query('limit', ParseNumberPipe({ nullable: true })) limit?: number,
    @Query('page', ParseNumberPipe({ nullable: true })) page?: number,
    @Query('name') name?: string,
    @Query('status') status?: string,
  ) {
    console.log(name, status)
    const nameQuery = name
      ? { name: { contains: name, mode: 'insensitive' } }
      : {}

    const statusQuery = status ? { status: { equals: status } } : {}
    const andQuery = { AND: [nameQuery, statusQuery] }

    console.log(andQuery)

    if (!limit) {
      return {
        plugins: await prisma.draftPlugin.findMany({ where: andQuery }),
        pagination: null,
      }
    }

    const currPage = page ? page : 1
    const offset = (currPage - 1) * limit
    const pluginCount = await prisma.draftPlugin.count()

    if (offset >= pluginCount) {
      throw new NotFoundException('There is not enough plugins')
    }

    const pages = Math.ceil(pluginCount / limit)

    return {
      plugins: await prisma.draftPlugin.findMany({
        skip: offset,
        take: limit,
      }),
      pagination: { pages, currPage, limit },
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
