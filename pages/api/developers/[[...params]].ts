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
    fetchWithPagination(
      'developerUser',
      limit,
      page,
      [],
      'There is not enough developers',
    )
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
    fetchWithPagination(
      'draftPlugin',
      limit,
      page,
      [
        {
          authorId: id as string,
        },
      ],
      'There is not enough plugins',
    )
  }
}

export default createHandler(Developers)
