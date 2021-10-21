import {
  createHandler,
  Get,
  Param,
  NotFoundException,
} from '@storyofams/next-api-decorators'
import { prisma } from '../../../config/PrismaClient'
import { NextAuthGuard } from '../../../shared/utils/apiDecorators'

@NextAuthGuard()
class Developers {
  @Get()
  getDeveloperList() {
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
