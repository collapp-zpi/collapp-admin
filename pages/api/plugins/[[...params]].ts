import { createHandler, Get, Param } from '@storyofams/next-api-decorators'
import { prisma } from '../../../config/PrismaClient'
import { NextAuthGuard } from '../../../shared/utils/apiDecorators'

@NextAuthGuard()
class Plugins {
  @Get()
  getPluginList() {
    return prisma.draftPlugin.findMany()
  }

  @Get('/:id')
  getPlugin(@Param('id') id: string) {
    return prisma.draftPlugin.findFirst({
      where: {
        id: id as string,
      },
    })
  }
}

export default createHandler(Plugins)
