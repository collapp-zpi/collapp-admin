import { createHandler, Get, Param } from '@storyofams/next-api-decorators'
import { prisma } from '../../../config/PrismaClient'
import { NextAuthGuard } from '../../../shared/utils/apiDecorators'

@NextAuthGuard()
class Developers {
  @Get()
  getDeveloperList() {
    return prisma.developerUser.findMany()
  }

  @Get('/:id')
  getDeveloper(@Param('id') id: string) {
    return prisma.developerUser.findFirst({
      where: {
        id: id as string,
      },
    })
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
