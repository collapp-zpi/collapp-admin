import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '../../../../config/PrismaClient'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ ok: false, message: 'Unauthorized' })
  }
  const { id } = req.query

  if (req.method !== 'GET')
    return res.status(405).json({ ok: false, message: 'Method not found' })

  const plugins = await prisma.draftPlugin.findMany({
    where: {
      authorId: id as string,
    },
  })

  if (req.method === 'GET') {
    return res.json(plugins)
  }
}
