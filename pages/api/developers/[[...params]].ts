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
class Developers {
  @Get()
  async getDeveloperList(
    @Query('limit', ParseNumberPipe({ nullable: true })) limit?: number,
    @Query('page', ParseNumberPipe({ nullable: true })) page?: number,
  ) {
    return await fetchWithPagination('developerUser', limit, page, [])
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
    return await fetchWithPagination('draftPlugin', limit, page, [
      {
        authorId: id,
      },
    ])
  }
}

export default createHandler(Developers)
