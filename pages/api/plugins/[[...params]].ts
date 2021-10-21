import {
  createHandler,
  Get,
  Param,
  NotFoundException,
} from '@storyofams/next-api-decorators'
import { prisma } from '../../../config/PrismaClient'
import { NextAuthGuard } from '../../../shared/utils/apiDecorators'

@NextAuthGuard()
class Plugins {
  @Get()
  getPluginList() {
    return prisma.draftPlugin.findMany()
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
