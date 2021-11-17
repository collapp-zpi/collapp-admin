import {
  createHandler,
  Get,
  Patch,
  Param,
  NotFoundException,
  Query,
  ParseNumberPipe,
  BadRequestException,
  UnauthorizedException,
} from '@storyofams/next-api-decorators'
import { prisma } from 'shared/utils/prismaClient'
import { NextAuthGuard, RequestUser, User } from 'shared/utils/apiDecorators'
import { fetchWithPagination } from 'shared/utils/fetchWithPagination'
import { amazonUrl } from 'shared/utils/awsHelpers'

enum Status {
  Private = 'Private',
  Pending = 'Pending',
  Updating = 'Updating',
}

@NextAuthGuard()
class Plugins {
  @Get()
  async getPluginList(
    @Query('limit', ParseNumberPipe({ nullable: true })) limit?: number,
    @Query('page', ParseNumberPipe({ nullable: true })) page?: number,
    @Query('name') name?: string,
    @Query('status') status?: Status,
  ) {
    return await fetchWithPagination('draftPlugin', limit, page, {
      ...(name && { name: { contains: name, mode: 'insensitive' } }),
      ...(status === Status.Private && {
        isPending: false,
      }),
      ...(status === Status.Pending && {
        isPending: true,
        published: null,
      }),
      ...(status === Status.Updating && {
        isPending: true,
        NOT: [
          {
            published: null,
          },
        ],
      }),
    })
  }

  @Get('/:id')
  async getPlugin(@Param('id') id: string) {
    const plugin = await prisma.draftPlugin.findFirst({
      where: { id },
      include: {
        source: {
          select: {
            date: true,
            name: true,
            size: true,
            url: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        logs: {
          include: {
            admin: true,
          },
        },
      },
    })

    if (!plugin) {
      throw new NotFoundException('The plugin was not found.')
    }

    return plugin
  }

  @Patch('/:id/reject')
  async rejectPlugin(@Param('id') id: string, @User user: RequestUser) {
    const plugin = await prisma.draftPlugin.findFirst({
      where: { id },
    })

    if (!plugin) {
      throw new NotFoundException('The plugin was not found.')
    }
    if (!plugin.isPending) {
      throw new BadRequestException(`Only pending plugins can be rejected.`)
    }

    const admin = await prisma.adminUser.findFirst({
      where: { email: user.email },
    })

    if (!admin) {
      throw new UnauthorizedException('Only admins can reject plugins.')
    }

    return await prisma.draftPlugin.update({
      where: { id },
      data: {
        isPending: false,
        logs: {
          create: [
            {
              content: 'Rejected',
              admin: {
                connect: {
                  id: admin.id,
                },
              },
            },
          ],
        },
      },
    })
  }

  @Patch('/:id/accept')
  async acceptPlugin(@Param('id') id: string, @User user: RequestUser) {
    const plugin = await prisma.draftPlugin.findFirst({
      where: { id },
      include: {
        source: true,
        author: true,
        published: {
          select: {
            source: {
              select: { id: true },
            },
          },
        },
      },
    })

    if (!plugin) {
      throw new NotFoundException('The plugin was not found.')
    }
    if (!plugin.isPending) {
      throw new BadRequestException(`Only pending plugins can be accepted.`)
    }
    if (plugin.isBuilding) {
      throw new BadRequestException(`Plugin is already being built.`)
    }
    if (!plugin.source) {
      throw new BadRequestException(`Plugin must have the source code.`)
    }

    const admin = await prisma.adminUser.findFirst({
      where: { email: user.email },
    })

    if (!admin) {
      throw new UnauthorizedException('Only admins can accept plugins.')
    }

    // if plugin is updated and source has not been changed
    if (
      plugin.published?.source?.id &&
      plugin.published.source.id === plugin.source.id
    ) {
      const updated = await prisma.publishedPlugin.update({
        where: { id },
        data: {
          name: plugin.name,
          description: plugin.description,
          icon: plugin.icon,
          minHeight: plugin.minHeight,
          minWidth: plugin.minWidth,
          maxHeight: plugin.maxHeight,
          maxWidth: plugin.maxWidth,
        },
      })
      await prisma.draftPlugin.update({
        where: { id },
        data: {
          isPending: false,
          logs: {
            create: [
              {
                content: 'Accepted',
                admin: {
                  connect: { id: admin.id },
                },
              },
            ],
          },
        },
      })
      return updated
    }

    const pluginToBeBuilt = await prisma.draftPlugin.update({
      where: { id },
      data: {
        isBuilding: true,
        logs: {
          create: [
            {
              content: 'Accepted',
              admin: {
                connect: { id: admin.id },
              },
            },
          ],
        },
      },
      include: {
        source: true,
        author: true,
      },
    })

    fetch('https://collapp-build-server.herokuapp.com/build', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestId: id,
        name: pluginToBeBuilt.name,
        developer: {
          name: pluginToBeBuilt.author.name,
          email: pluginToBeBuilt.author.email,
        },
        zip: {
          url: amazonUrl + pluginToBeBuilt.source?.url,
        },
      }),
    })

    return pluginToBeBuilt
  }
}

export default createHandler(Plugins)
