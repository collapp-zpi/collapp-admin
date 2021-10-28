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
import { fetchWithPagination } from 'shared/utils/fetchWithPagination'

@NextAuthGuard()
class Plugins {
  @Get()
  async getPluginList(
    @Query('limit', ParseNumberPipe({ nullable: true })) limit?: number,
    @Query('page', ParseNumberPipe({ nullable: true })) page?: number,
    @Query('name') name?: string,
    @Query('status') status?: string,
  ) {
    const nameQuery = name
      ? { name: { contains: name, mode: 'insensitive' } }
      : {}
    const statusQuery = status ? { status: { equals: status } } : {}
    return await fetchWithPagination('draftPlugin', limit, page, [
      nameQuery,
      statusQuery,
    ])
  }

  @Get('/:id')
  async getPlugin(@Param('id') id: string) {
    const plugin = await prisma.draftPlugin.findFirst({
      where: { id },
    })

    if (!plugin) {
      throw new NotFoundException('The plugin was not found.')
    }

    return plugin
  }
}

export default createHandler(Plugins)
